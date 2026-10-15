import { Injectable, type CallHandler, type ExecutionContext, type NestInterceptor } from "@nestjs/common";
import { type Observable } from "rxjs";
import { map } from "rxjs/operators";
import { randomUUID } from "node:crypto";

/**
 * Ensures every response carries a correlation id, so a client-reported failure
 * can be traced to a single request in the logs.
 */
@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<{ headers: Record<string, string | string[] | undefined>; id?: string }>();
    const response = http.getResponse<{ setHeader: (name: string, value: string) => void }>();

    const existing = request.headers["x-request-id"];
    const requestId =
      typeof existing === "string" && existing.length > 0 ? existing : randomUUID();

    request.id = requestId;
    response.setHeader("x-request-id", requestId);

    return next.handle().pipe(
      map((data) => {
        // Envelope list-shaped responses with the correlation id so clients can
        // quote it in support requests.
        if (data && typeof data === "object" && !Array.isArray(data)) {
          return { ...(data as Record<string, unknown>), requestId };
        }
        return data;
      }),
    );
  }
}
