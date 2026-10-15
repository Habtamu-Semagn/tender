import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createHash, randomUUID } from "node:crypto";
import { createReadStream, createWriteStream } from "node:fs";
import { mkdir, stat, unlink } from "node:fs/promises";
import { dirname, join, normalize, resolve, sep } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { ErrorCode } from "../common/errors/error-codes.js";
import { AppException } from "../common/errors/app.exception.js";

/** Where an uploaded file is allowed to be used. */
export type StoragePurpose =
  | "ORGANIZATION_VERIFICATION"
  | "TENDER_ATTACHMENT"
  | "TENDER_AMENDMENT"
  | "BID_ATTACHMENT"
  | "CLARIFICATION_ATTACHMENT"
  | "EVALUATION_EVIDENCE";

export interface StoredObjectRef {
  /** Server-generated storage key. Never derived from user input. */
  storageKey: string;
  /** Original filename, sanitized. */
  originalFileName: string;
  /** Content type detected by the server. */
  contentType: string;
  sizeBytes: number;
  checksumSha256: string;
}

/** Extension allowlist mapped to the content types we accept. */
const ALLOWED_TYPES: Record<string, { contentType: string; maxBytes: number }> = {
  ".pdf": { contentType: "application/pdf", maxBytes: 25 * 1024 * 1024 },
  ".doc": { contentType: "application/msword", maxBytes: 25 * 1024 * 1024 },
  ".docx": {
    contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    maxBytes: 25 * 1024 * 1024,
  },
  ".xls": { contentType: "application/vnd.ms-excel", maxBytes: 25 * 1024 * 1024 },
  ".xlsx": {
    contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    maxBytes: 25 * 1024 * 1024,
  },
  ".png": { contentType: "image/png", maxBytes: 5 * 1024 * 1024 },
  ".jpg": { contentType: "image/jpeg", maxBytes: 5 * 1024 * 1024 },
  ".jpeg": { contentType: "image/jpeg", maxBytes: 5 * 1024 * 1024 },
  ".csv": { contentType: "text/csv", maxBytes: 10 * 1024 * 1024 },
  ".txt": { contentType: "text/plain", maxBytes: 2 * 1024 * 1024 },
  ".zip": { contentType: "application/zip", maxBytes: 50 * 1024 * 1024 },
};

/** Magic-number prefixes used to detect the real type regardless of extension. */
const MAGIC_SIGNATURES: { test: (buf: Buffer) => boolean; contentType: string; ext: string }[] = [
  { test: (b) => b.subarray(0, 5).toString() === "%PDF-", contentType: "application/pdf", ext: ".pdf" },
  { test: (b) => b[0] === 0x50 && b[1] === 0x4b, contentType: "application/zip", ext: ".zip" },
  { test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff, contentType: "image/jpeg", ext: ".jpg" },
  { test: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47, contentType: "image/png", ext: ".png" },
  { test: (b) => b[0] === 0xd0 && b[1] === 0xcf, contentType: "application/msword", ext: ".doc" },
];

/**
 * Object storage abstraction.
 *
 * SECURITY:
 *   - File type is validated by extension allowlist AND magic-number sniffing;
 *     the client's declared MIME type is never trusted.
 *   - Storage keys are generated server-side; user-supplied names never form a
 *     path, so path traversal is structurally impossible.
 *   - Buckets are private. Downloads happen only through short-lived signed URLs
 *     minted after an authorization check, and no public URLs are ever produced.
 *   - Objects are checksummed on write so integrity can be verified later.
 */
@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly driver: "local" | "s3";
  private readonly localPath: string;
  private readonly s3: S3Client | null = null;
  private readonly bucket: string;
  private readonly signedUrlTtlSeconds = 300;

  constructor(private readonly config: ConfigService) {
    this.driver = this.config.getOrThrow<"local" | "s3">("app.storage.driver");
    this.localPath = resolve(this.config.getOrThrow<string>("app.storage.localPath"));
    this.bucket = this.config.get<string>("app.storage.s3.bucket") ?? "chereta-documents";

    if (this.driver === "s3") {
      this.s3 = new S3Client({
        region: this.config.get<string>("app.storage.s3.region") ?? "us-east-1",
        endpoint: this.config.get<string>("app.storage.s3.endpoint"),
        forcePathStyle: this.config.get<boolean>("app.storage.s3.forcePathStyle") ?? true,
        credentials: {
          accessKeyId: this.config.getOrThrow<string>("app.storage.s3.accessKeyId"),
          secretAccessKey: this.config.getOrThrow<string>("app.storage.s3.secretAccessKey"),
        },
      });
    }
  }

  /** True when the local filesystem driver is in use (development and tests). */
  get isLocal(): boolean {
    return this.driver === "local";
  }

  /**
   * Stores an uploaded file, validating type and size, and returns its metadata.
   * `purpose` selects the directory prefix and the applicable size cap.
   */
  async store(params: {
    purpose: StoragePurpose;
    buffer: Buffer;
    originalFileName: string;
    declaredContentType?: string;
    /** Optional tighter cap than the per-extension default. */
    maxBytes?: number;
  }): Promise<StoredObjectRef> {
    const { purpose, buffer, originalFileName, declaredContentType, maxBytes } = params;

    const detected = this.detectType(buffer, originalFileName, declaredContentType);
    if (!detected) {
      throw new AppException(
        ErrorCode.UNSUPPORTED_FILE_TYPE,
        "This file type is not accepted. Allowed: PDF, Word, Excel, CSV, TXT, PNG, JPEG, ZIP.",
        400,
      );
    }

    const cap = Math.min(maxBytes ?? detected.maxBytes, detected.maxBytes);
    if (buffer.byteLength > cap) {
      throw new AppException(
        ErrorCode.FILE_TOO_LARGE,
        `File exceeds the maximum allowed size of ${Math.floor(cap / (1024 * 1024))} MB.`,
        400,
      );
    }

    if (buffer.byteLength === 0) {
      throw new AppException(ErrorCode.VALIDATION_FAILED, "Uploaded file is empty.", 400);
    }

    const checksumSha256 = createHash("sha256").update(buffer).digest("hex");
    const storageKey = this.buildKey(purpose, detected.ext, checksumSha256);

    if (this.driver === "s3") {
      await this.s3!.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: storageKey,
          Body: buffer,
          ContentType: detected.contentType,
          ContentLength: buffer.byteLength,
          // Server-side encryption at rest.
          ServerSideEncryption: "AES256",
          Metadata: {
            "original-file-name": this.sanitizeFileName(originalFileName),
            "x-checksum-sha256": checksumSha256,
          },
        }),
      );
    } else {
      const absolute = this.resolveLocalPath(storageKey);
      await mkdir(dirname(absolute), { recursive: true });
      await pipeline(Readable.from(buffer), createWriteStream(absolute));
    }

    this.logger.log(
      `Stored ${purpose} object ${storageKey} (${buffer.byteLength} bytes, ${detected.contentType})`,
    );

    return {
      storageKey,
      originalFileName: this.sanitizeFileName(originalFileName),
      contentType: detected.contentType,
      sizeBytes: buffer.byteLength,
      checksumSha256,
    };
  }

  /**
   * Returns a short-lived signed download URL. Callers MUST authorize the request
   * before invoking this; the URL is the only way document bytes are exposed.
   */
  async createSignedDownloadUrl(storageKey: string, downloadFileName?: string): Promise<string> {
    const safeName = downloadFileName ? this.sanitizeFileName(downloadFileName) : undefined;

    if (this.driver === "s3") {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: storageKey,
        ...(safeName
          ? { ResponseContentDisposition: `attachment; filename="${safeName}"` }
          : {}),
      });
      return getSignedUrl(this.s3!, command, { expiresIn: this.signedUrlTtlSeconds });
    }

    // Local driver: serve through an authorized API route rather than exposing a
    // filesystem path. The API proxies the stream after its own permission check.
    const token = this.signLocalToken(storageKey, safeName);
    // This route is excluded from the api/v1 prefix (see main.ts), so the URL is
    // built from the bare base path rather than the API prefix.
    return `${this.config.getOrThrow<string>("app.apiBaseUrl")}/documents/local-download?token=${encodeURIComponent(token)}`;
  }

  /**
   * Validates and decodes a local-driver download token. Returns null when the
   * token is malformed or expired.
   */
  verifyLocalToken(token: string): { storageKey: string; fileName?: string } | null {
    // Format: expires.hmac.payload — the payload itself is not split on ".".
    const firstDot = token.indexOf(".");
    const secondDot = token.indexOf(".", firstDot + 1);
    if (firstDot < 0 || secondDot < 0) return null;

    const expiresRaw = token.slice(0, firstDot);
    const hmac = token.slice(firstDot + 1, secondDot);
    const payload = token.slice(secondDot + 1);
    if (!expiresRaw || !hmac || !payload) return null;

    const expires = Number(expiresRaw);
    if (!Number.isFinite(expires) || Date.now() > expires) return null;

    const expected = createHash("sha256")
      .update(`${expiresRaw}~${payload}~${this.config.getOrThrow<string>("app.csrfSecret")}`)
      .digest("hex");
    if (expected !== hmac) return null;

    const separatorIndex = payload.indexOf("~");
    const storageKey = separatorIndex < 0 ? payload : payload.slice(0, separatorIndex);
    const rawName = separatorIndex < 0 ? undefined : payload.slice(separatorIndex + 1);
    if (!storageKey) return null;
    return { storageKey, fileName: rawName ? decodeURIComponent(rawName) : undefined };
  }

  /** Streams an object out of local storage. Caller must have authorized access. */
  async readLocal(storageKey: string): Promise<{ stream: Readable; contentType: string; sizeBytes: number }> {
    const absolute = this.resolveLocalPath(storageKey);
    try {
      const info = await stat(absolute);
      return {
        stream: createReadStream(absolute),
        contentType: this.contentTypeFromKey(storageKey),
        sizeBytes: info.size,
      };
    } catch {
      throw new AppException(
        ErrorCode.DOCUMENT_NOT_FOUND,
        "The requested document could not be found in storage.",
        404,
      );
    }
  }

  async exists(storageKey: string): Promise<boolean> {
    if (this.driver === "s3") {
      try {
        await this.s3!.send(new HeadObjectCommand({ Bucket: this.bucket, Key: storageKey }));
        return true;
      } catch {
        return false;
      }
    }
    try {
      await stat(this.resolveLocalPath(storageKey));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Deletes an object. Used only for replacing a document under a revision
   * workflow; business records are never deleted for audit reasons.
   */
  async remove(storageKey: string): Promise<void> {
    if (this.driver === "s3") {
      await this.s3!.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: storageKey }));
      return;
    }
    try {
      await unlink(this.resolveLocalPath(storageKey));
    } catch {
      // Already gone; nothing to do.
    }
  }

  // --- Internals --------------------------------------------------------------

  private detectType(
    buffer: Buffer,
    originalFileName: string,
    declaredContentType?: string,
  ): { contentType: string; ext: string; maxBytes: number } | null {
    const lower = originalFileName.toLowerCase();
    const ext = Object.keys(ALLOWED_TYPES).find((candidate) => lower.endsWith(candidate));
    if (!ext) return null;

    // Sniff the actual signature. When sniffing succeeds it must be consistent
    // with the extension's family; a mismatch is rejected outright.
    const signature = MAGIC_SIGNATURES.find((sig) => sig.test(buffer));
    if (signature) {
      const familyOf = (contentType: string): string =>
        contentType.startsWith("image/") ? "image" : contentType.split("/")[0] ?? "";

      const declaredFamily = familyOf(ALLOWED_TYPES[ext].contentType);
      const detectedFamily = familyOf(signature.contentType);
      if (declaredFamily !== detectedFamily) {
        this.logger.warn(
          `Rejected upload: extension ${ext} does not match detected type ${signature.contentType}`,
        );
        return null;
      }
    }

    // A file that claims .pdf but has no %PDF- header is a likely spoof.
    if (ext === ".pdf" && !buffer.subarray(0, 5).toString().startsWith("%PDF-")) {
      this.logger.warn("Rejected upload: .pdf extension without a PDF signature");
      return null;
    }

    void declaredContentType; // Deliberately unused: client-declared MIME is not trusted.
    return { ...ALLOWED_TYPES[ext], ext };
  }

  private buildKey(purpose: StoragePurpose, ext: string, checksum: string): string {
    const now = new Date();
    const yyyy = now.getUTCFullYear();
    const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
    // Content-addressed segment makes keys unpredictable and collision-free.
    return `${purpose.toLowerCase()}/${yyyy}/${mm}/${randomUUID()}-${checksum.slice(0, 16)}${ext}`;
  }

  /**
   * Resolves a storage key to an absolute local path, rejecting anything that
   * escapes the storage root. Defence in depth against path traversal.
   */
  private resolveLocalPath(storageKey: string): string {
    const normalized = normalize(storageKey).replace(/^(\.\.[/\\])+/, "");
    if (normalized.includes("..") || normalized.startsWith("/") || normalized.includes("\0")) {
      throw new AppException(
        ErrorCode.STORAGE_ERROR,
        "Invalid storage key.",
        400,
      );
    }
    const absolute = resolve(join(this.localPath, normalized));
    if (!absolute.startsWith(this.localPath + sep) && absolute !== this.localPath) {
      throw new AppException(ErrorCode.STORAGE_ERROR, "Invalid storage key.", 400);
    }
    return absolute;
  }

  private signLocalToken(storageKey: string, fileName?: string): string {
    const expires = Date.now() + this.signedUrlTtlSeconds * 1000;
    const expiresRaw = String(expires);
    // The payload uses "~" as the field separator: storage keys contain dots and
    // slashes, so a dot-separated token would be ambiguous to parse.
    const payload = fileName
      ? `${storageKey}~${encodeURIComponent(fileName)}`
      : storageKey;
    const hmac = createHash("sha256")
      .update(`${expiresRaw}~${payload}~${this.config.getOrThrow<string>("app.csrfSecret")}`)
      .digest("hex");
    return `${expiresRaw}.${hmac}.${payload}`;
  }

  private contentTypeFromKey(storageKey: string): string {
    const ext = Object.keys(ALLOWED_TYPES).find((candidate) => storageKey.endsWith(candidate));
    return ext ? ALLOWED_TYPES[ext].contentType : "application/octet-stream";
  }

  /** Strips path separators and control characters from a user-supplied filename. */
  private sanitizeFileName(name: string): string {
    return name
      .replace(/[/\\]/g, "_")
      .replace(/[\u0000-\u001f\u007f]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(-180) || "document";
  }
}
