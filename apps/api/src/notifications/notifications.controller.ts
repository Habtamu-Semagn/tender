import { Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  type Notification,
  type ListNotificationsQuery,
  type UnreadCount,
  listNotificationsQuerySchema,
} from "@chereta/contracts";
import { NotificationService } from "./notification.service.js";
import { type RequestWithActor } from "../audit/audit.service.js";
import { ErrorCode } from "../common/errors/error-codes.js";
import { AppException } from "../common/errors/app.exception.js";
import { PrismaService } from "../prisma/prisma.service.js";

/**
 * In-app notification centre.
 *
 * Every route is scoped to the caller: a user can only ever list, read, or count
 * their own notifications. The read/read-all mutations use updateMany filtered by
 * userId, so there is no way to mark another user's notification as read.
 */
@ApiTags("notifications")
@ApiBearerAuth()
@Controller("notifications")
export class NotificationsController {
  constructor(
    private readonly notifications: NotificationService,
    private readonly prisma: PrismaService,
  ) {}

  private actor(request: RequestWithActor) {
    if (!request.actor) {
      throw new AppException(ErrorCode.UNAUTHENTICATED, "Authentication required.", 401);
    }
    return request.actor;
  }

  @Get()
  @ApiOperation({ summary: "List my notifications (newest first)" })
  @ApiResponse({ status: 200, description: "Notifications." })
  async list(
    @Req() request: RequestWithActor,
    @Query({ schema: listNotificationsQuerySchema }) query: ListNotificationsQuery,
  ): Promise<{ items: Notification[]; nextCursor: string | null }> {
    const actor = this.actor(request);
    const rows = await this.prisma.notification.findMany({
      where: {
        userId: actor.userId,
        ...(query.unreadOnly ? { readAt: null } : {}),
      },
      select: {
        id: true,
        type: true,
        title: true,
        body: true,
        actionUrl: true,
        entityType: true,
        entityId: true,
        readAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: query.limit + 1,
      ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
    });

    const hasMore = rows.length > query.limit;
    const items = hasMore ? rows.slice(0, query.limit) : rows;

    return {
      items: items.map((row) => ({
        id: row.id,
        type: row.type,
        title: row.title,
        body: row.body,
        actionUrl: row.actionUrl,
        entityType: row.entityType,
        entityId: row.entityId,
        readAt: row.readAt?.toISOString() ?? null,
        createdAt: row.createdAt.toISOString(),
      })),
      nextCursor: hasMore ? (items[items.length - 1]?.id ?? null) : null,
    };
  }

  @Get("unread-count")
  @ApiOperation({ summary: "My unread notification count" })
  @ApiResponse({ status: 200, description: "Unread count." })
  async unreadCount(@Req() request: RequestWithActor): Promise<UnreadCount> {
    const actor = this.actor(request);
    return { unread: await this.notifications.unreadCount(actor.userId) };
  }

  @Patch(":id/read")
  @ApiOperation({ summary: "Mark one of my notifications as read" })
  @ApiResponse({ status: 200, description: "Whether a notification was updated." })
  async markRead(
    @Req() request: RequestWithActor,
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{ updated: boolean }> {
    const actor = this.actor(request);
    // Scoped to userId inside the service: cannot mark another user's as read.
    return { updated: await this.notifications.markRead(actor.userId, id) };
  }

  @Post("read-all")
  @ApiOperation({ summary: "Mark all my notifications as read" })
  @ApiResponse({ status: 200, description: "How many were updated." })
  async markAllRead(@Req() request: RequestWithActor): Promise<{ updated: number }> {
    const actor = this.actor(request);
    return { updated: await this.notifications.markAllRead(actor.userId) };
  }
}
