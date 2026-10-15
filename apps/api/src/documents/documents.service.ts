import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { type DocumentPurpose, type DocumentResponse } from "@chereta/contracts";
import { PrismaService } from "../prisma/prisma.service.js";
import { StorageService } from "./storage.service.js";
import { AuditService, type RequestWithActor } from "../audit/audit.service.js";
import { ErrorCode } from "../common/errors/error-codes.js";
import { AppException } from "../common/errors/app.exception.js";

/**
 * Document uploads and authorized downloads.
 *
 * SECURITY:
 *   - Uploads validate type and size server-side (see StorageService); the
 *     client's filename and MIME type are never trusted.
 *   - Every download is authorized here first. A signed URL is minted only after
 *     the caller's rights to this specific document have been established, and it
 *     expires in minutes.
 *   - Storage keys are server-generated, so document paths are never public and
 *     cannot be guessed or traversed.
 *   - Download events are audited, which is what makes confidential bid opening
 *     attributable.
 */
@Injectable()
export class DocumentsService {
  /** Per-purpose size caps, tighter than the per-type maximums. */
  private static readonly PURPOSE_CAPS: Record<DocumentPurpose, number> = {
    ORGANIZATION_VERIFICATION: 10 * 1024 * 1024,
    TENDER_ATTACHMENT: 25 * 1024 * 1024,
    TENDER_AMENDMENT: 25 * 1024 * 1024,
    BID_ATTACHMENT: 25 * 1024 * 1024,
    CLARIFICATION_ATTACHMENT: 10 * 1024 * 1024,
    EVALUATION_EVIDENCE: 15 * 1024 * 1024,
  };

  /** Maximum documents a single user may have uploaded overall. */
  private static readonly MAX_DOCUMENTS_PER_USER = 500;

  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly audit: AuditService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Stores an upload and records its metadata.
   *
   * The caller must already have been authorized to upload for the given purpose;
   * this method performs the storage-side checks (type, size, quota) only.
   */
  async upload(params: {
    userId: string;
    purpose: DocumentPurpose;
    buffer: Buffer;
    originalFileName: string;
    declaredContentType?: string;
    request: RequestWithActor;
  }): Promise<DocumentResponse> {
    const { userId, purpose, buffer, originalFileName, declaredContentType, request } = params;

    const existingCount = await this.prisma.document.count({
      where: { uploadedById: userId, deletedAt: null },
    });
    if (existingCount >= DocumentsService.MAX_DOCUMENTS_PER_USER) {
      throw new AppException(
        ErrorCode.UPLOAD_LIMIT_EXCEEDED,
        "You have reached the maximum number of uploaded documents. Remove unused documents first.",
        429,
      );
    }

    const stored = await this.storage.store({
      // DocumentPurpose and StoragePurpose are the same union; no cast needed.
      purpose,
      buffer,
      originalFileName,
      declaredContentType,
      maxBytes: DocumentsService.PURPOSE_CAPS[purpose],
    });

    const document = await this.prisma.document.create({
      data: {
        storageKey: stored.storageKey,
        originalFileName: stored.originalFileName,
        contentType: stored.contentType,
        sizeBytes: stored.sizeBytes,
        checksumSha256: stored.checksumSha256,
        uploadedById: userId,
      },
      select: {
        id: true,
        storageKey: true,
        originalFileName: true,
        contentType: true,
        sizeBytes: true,
        checksumSha256: true,
        createdAt: true,
      },
    });

    await this.audit.record(
      this.audit.fromRequest(request, {
        action: "document.uploaded",
        entityType: "Document",
        entityId: document.id,
        targetUserId: userId,
        metadata: { purpose, sizeBytes: document.sizeBytes, contentType: document.contentType },
      }),
    );

    return {
      id: document.id,
      fileName: document.originalFileName,
      contentType: document.contentType,
      sizeBytes: document.sizeBytes,
      checksumSha256: document.checksumSha256,
      purpose,
      // The uploader may immediately re-download their own file.
      downloadUrl: await this.storage.createSignedDownloadUrl(
        document.storageKey,
        document.originalFileName,
      ).catch(() => null),
      createdAt: document.createdAt.toISOString(),
    };
  }

  /**
   * Returns a short-lived signed download URL for a document the caller is
   * entitled to read.
   *
   * `authorize` is supplied by the calling module, which knows the document's
   * context (tender attachment, bid attachment, verification document). It must
   * throw when access is not permitted — this method never guesses.
   */
  async createAuthorizedDownloadUrl(params: {
    documentId: string;
    request: RequestWithActor;
    /** Must throw unless the caller may read this document. */
    authorize: () => Promise<void>;
  }): Promise<{ url: string; fileName: string; contentType: string; sizeBytes: number }> {
    const { documentId, request, authorize } = params;

    const document = await this.prisma.document.findFirst({
      where: { id: documentId, deletedAt: null },
      select: {
        id: true,
        storageKey: true,
        originalFileName: true,
        contentType: true,
        sizeBytes: true,
      },
    });

    if (!document) {
      throw new AppException(ErrorCode.DOCUMENT_NOT_FOUND, "Document not found.", 404);
    }

    // The caller's context-specific permission check runs before any URL exists.
    await authorize();

    const url = await this.storage.createSignedDownloadUrl(
      document.storageKey,
      document.originalFileName,
    );

    await this.audit.record(
      this.audit.fromRequest(request, {
        action: "document.download.authorized",
        entityType: "Document",
        entityId: document.id,
        metadata: { sizeBytes: document.sizeBytes },
      }),
    );

    return {
      url,
      fileName: document.originalFileName,
      contentType: document.contentType,
      sizeBytes: document.sizeBytes,
    };
  }

  /**
   * Serves a local-driver download after token verification. Used by the
   * documents controller's local-download route.
   */
  async resolveLocalDownload(token: string): Promise<{
    stream: import("node:stream").Readable;
    contentType: string;
    sizeBytes: number;
    fileName?: string;
  }> {
    const decoded = this.storage.verifyLocalToken(token);
    if (!decoded) {
      throw new AppException(
        ErrorCode.TOKEN_INVALID,
        "This download link is invalid or has expired.",
        401,
      );
    }

    const document = await this.prisma.document.findFirst({
      where: { storageKey: decoded.storageKey, deletedAt: null },
      select: { id: true, originalFileName: true },
    });

    if (!document) {
      throw new AppException(ErrorCode.DOCUMENT_NOT_FOUND, "Document not found.", 404);
    }

    const result = await this.storage.readLocal(decoded.storageKey);
    return {
      ...result,
      fileName: decoded.fileName ?? document.originalFileName,
    };
  }

  /** Loads document metadata for internal authorization checks. */
  async getMetadata(documentId: string) {
    return this.prisma.document.findFirst({
      where: { id: documentId, deletedAt: null },
      select: {
        id: true,
        storageKey: true,
        originalFileName: true,
        contentType: true,
        sizeBytes: true,
        checksumSha256: true,
        uploadedById: true,
      },
    });
  }

  /** Public base URL, used when constructing links. */
  get publicBaseUrl(): string {
    return this.config.getOrThrow<string>("app.apiBaseUrl");
  }
}
