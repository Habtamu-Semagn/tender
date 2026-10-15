import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
  ParseUUIDPipe,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { type Response as ExpressResponse } from "express";
import { documentPurposeSchema } from "@chereta/contracts";
import { DocumentsService } from "./documents.service.js";
import { Public } from "../auth/roles.guard.js";
import { type RequestWithActor } from "../audit/audit.service.js";
import { ErrorCode } from "../common/errors/error-codes.js";
import { AppException } from "../common/errors/app.exception.js";

/**
 * Document endpoints.
 *
 * Uploads are authenticated; downloads are authorized per document by the owning
 * module (tenders, bids, organizations) rather than here, because permission
 * depends on the document's context.
 */
@ApiTags("documents")
@ApiBearerAuth()
@Controller("documents")
export class DocumentsController {
  constructor(private readonly documents: DocumentsService) {}

  @Post("upload")
  @ApiConsumes("multipart/form-data")
  @ApiOperation({
    summary: "Upload a document",
    description:
      "The file is validated server-side (extension allowlist plus magic-number sniffing) and stored privately. Use the returned id when attaching it to a tender, bid or verification request.",
  })
  @ApiResponse({ status: 201, description: "Document stored." })
  @ApiResponse({ status: 400, description: "Unsupported file type or too large." })
  @UseInterceptors(
    FileInterceptor("file", {
      // Buffer in memory: the bytes are validated and written to private storage
      // immediately, never to a public or temporary directory.
      limits: { fileSize: 60 * 1024 * 1024, files: 1 },
    }),
  )
  async upload(
    @Req() request: RequestWithActor,
    @UploadedFile() file: { buffer: Buffer; originalname: string; mimetype?: string } | undefined,
    @Query("purpose") purpose?: string,
  ) {
    const actor = request.actor;
    if (!actor) {
      throw new AppException(ErrorCode.UNAUTHENTICATED, "Authentication required.", 401);
    }

    if (!file) {
      throw new AppException(ErrorCode.VALIDATION_FAILED, "A file is required.", 400);
    }

    const parsedPurpose = documentPurposeSchema.safeParse(purpose ?? "TENDER_ATTACHMENT");
    if (!parsedPurpose.success) {
      throw new AppException(ErrorCode.VALIDATION_FAILED, "Invalid upload purpose.", 400);
    }

    return this.documents.upload({
      userId: actor.userId,
      purpose: parsedPurpose.data,
      buffer: file.buffer,
      originalFileName: file.originalname,
      declaredContentType: file.mimetype,
      request,
    });
  }

  /**
   * Serves a local-driver download. The URL is short-lived and signed, and the
   * signing key is a server secret; with the S3 driver this route is unused
   * because downloads go directly to the bucket with a presigned URL.
   */
  @Get("local-download")
  @Public()
  @ApiOperation({ summary: "Stream a document through a short-lived signed link" })
  async localDownload(@Query("token") token: string, @Res() response: ExpressResponse) {
    if (!token) {
      throw new AppException(ErrorCode.TOKEN_INVALID, "A download token is required.", 400);
    }

    const resolved = await this.documents.resolveLocalDownload(token);

    response.setHeader("Content-Type", resolved.contentType);
    response.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(resolved.fileName ?? "document")}"`,
    );
    response.setHeader("Content-Length", String(resolved.sizeBytes));
    // Documents are never cached by intermediaries.
    response.setHeader("Cache-Control", "private, no-store");
    response.setHeader("X-Content-Type-Options", "nosniff");

    resolved.stream.pipe(response);
  }

  /**
   * Returns a short-lived signed URL for a document.
   *
   * SECURITY: this endpoint only serves documents the caller uploaded themselves.
   * Context-specific access (tender attachments, bid attachments) is authorized
   * by the tenders and bids modules, which issue their own links.
   */
  @Get(":id/download-url")
  @ApiOperation({ summary: "Get a short-lived signed URL for a document you uploaded" })
  async downloadUrl(
    @Req() request: RequestWithActor,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    const actor = request.actor;
    if (!actor) {
      throw new AppException(ErrorCode.UNAUTHENTICATED, "Authentication required.", 401);
    }

    return this.documents.createAuthorizedDownloadUrl({
      documentId: id,
      request,
      authorize: async () => {
        const metadata = await this.documents.getMetadata(id);
        if (!metadata || metadata.uploadedById !== actor.userId) {
          throw new AppException(
            ErrorCode.BID_ACCESS_DENIED,
            "You do not have permission to download this document.",
            403,
          );
        }
      },
    });
  }
}

export { BadRequestException };
