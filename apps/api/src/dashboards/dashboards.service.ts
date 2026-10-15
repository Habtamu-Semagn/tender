import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { OrganizationAccessService } from "../organizations/organization-access.service.js";

/**
 * Role dashboards.
 *
 * Every number is produced by a real query — never a cached or estimated figure —
 * so a dashboard count is always equal to what a direct SQL count would return.
 * Each dashboard is scoped to the caller: a supplier sees their own bidding
 * activity, a publisher sees their organizations' procurement activity.
 */

export interface DashboardCounts {
  [key: string]: number;
}

@Injectable()
export class DashboardsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: OrganizationAccessService,
  ) {}

  /**
   * Supplier dashboard: the caller's own bidding activity across their
   * organizations.
   */
  async supplierDashboard(userId: string): Promise<{
    activeBids: number;
    submittedBids: number;
    awardedBids: number;
    withdrawnBids: number;
    openTendersMatchingInterests: number;
    savedTenders: number;
    unreadNotifications: number;
    upcomingDeadlines: Array<{ tenderId: string; referenceNumber: string; title: string; submissionDeadline: string }>;
  }> {
    const memberships = await this.access.listForUser(userId);
    const orgIds = memberships.map((m) => m.organization.id);

    const [activeBids, submittedBids, awardedBids, withdrawnBids, savedTenders, unreadNotifications] =
      await Promise.all([
        this.prisma.bid.count({
          where: { organizationId: { in: orgIds }, status: { in: ["DRAFT", "SUBMITTED"] } },
        }),
        this.prisma.bid.count({
          where: { organizationId: { in: orgIds }, status: "SUBMITTED" },
        }),
        this.prisma.bid.count({
          where: { organizationId: { in: orgIds }, status: "AWARDED" },
        }),
        this.prisma.bid.count({
          where: { organizationId: { in: orgIds }, status: "WITHDRAWN" },
        }),
        this.prisma.savedTender.count({ where: { userId } }),
        this.prisma.notification.count({ where: { userId, readAt: null } }),
      ]);

    // Tenders the caller has an active (submitted) bid on that close soonest.
    const upcoming = await this.prisma.bid.findMany({
      where: {
        organizationId: { in: orgIds },
        status: "SUBMITTED",
        tender: { status: "OPEN_FOR_SUBMISSION", submissionDeadline: { gt: new Date() } },
      },
      select: {
        tender: {
          select: {
            id: true,
            referenceNumber: true,
            title: true,
            submissionDeadline: true,
          },
        },
      },
      orderBy: { tender: { submissionDeadline: "asc" } },
      take: 5,
    });

    return {
      activeBids,
      submittedBids,
      awardedBids,
      withdrawnBids,
      openTendersMatchingInterests: savedTenders,
      savedTenders,
      unreadNotifications,
      upcomingDeadlines: upcoming.map((row) => ({
        tenderId: row.tender.id,
        referenceNumber: row.tender.referenceNumber,
        title: row.tender.title,
        submissionDeadline: row.tender.submissionDeadline?.toISOString() ?? "",
      })),
    };
  }

  /**
   * Publisher dashboard: procurement activity across every organization the
   * caller belongs to.
   */
  async publisherDashboard(userId: string): Promise<{
    organizations: number;
    publishedTenders: number;
    draftTenders: number;
    openForSubmission: number;
    awardedTenders: number;
    totalBidsReceived: number;
    pendingEvaluations: number;
    unreadNotifications: number;
  }> {
    const memberships = await this.access.listForUser(userId);
    const orgIds = memberships.map((m) => m.organization.id);

    const [
      publishedTenders,
      draftTenders,
      openForSubmission,
      awardedTenders,
      totalBidsReceived,
      pendingEvaluations,
      unreadNotifications,
    ] = await Promise.all([
      this.prisma.tender.count({
        where: { organizationId: { in: orgIds }, status: { in: ["PUBLISHED", "OPEN_FOR_SUBMISSION"] } },
      }),
      this.prisma.tender.count({
        where: { organizationId: { in: orgIds }, status: { in: ["DRAFT", "PENDING_APPROVAL"] } },
      }),
      this.prisma.tender.count({
        where: { organizationId: { in: orgIds }, status: "OPEN_FOR_SUBMISSION" },
      }),
      this.prisma.tender.count({
        where: { organizationId: { in: orgIds }, status: "AWARDED" },
      }),
      this.prisma.bid.count({
        where: { tender: { organizationId: { in: orgIds } }, status: { not: "DRAFT" } },
      }),
      this.prisma.evaluationAssignment.count({
        where: { tender: { organizationId: { in: orgIds } }, status: { in: ["ASSIGNED", "IN_PROGRESS"] } },
      }),
      this.prisma.notification.count({ where: { userId, readAt: null } }),
    ]);

    return {
      organizations: orgIds.length,
      publishedTenders,
      draftTenders,
      openForSubmission,
      awardedTenders,
      totalBidsReceived,
      pendingEvaluations,
      unreadNotifications,
    };
  }

  /**
   * Evaluator dashboard: the caller's assignment workload.
   */
  async evaluatorDashboard(userId: string): Promise<{
    assigned: number;
    inProgress: number;
    submitted: number;
    overdue: number;
    unreadNotifications: number;
  }> {
    const [assigned, inProgress, submitted, overdue, unreadNotifications] = await Promise.all([
      this.prisma.evaluationAssignment.count({ where: { evaluatorId: userId, status: "ASSIGNED" } }),
      this.prisma.evaluationAssignment.count({ where: { evaluatorId: userId, status: "IN_PROGRESS" } }),
      this.prisma.evaluationAssignment.count({ where: { evaluatorId: userId, status: "SUBMITTED" } }),
      this.prisma.evaluationAssignment.count({
        where: {
          evaluatorId: userId,
          status: { in: ["ASSIGNED", "IN_PROGRESS"] },
          dueAt: { lt: new Date() },
        },
      }),
      this.prisma.notification.count({ where: { userId, readAt: null } }),
    ]);

    return { assigned, inProgress, submitted, overdue, unreadNotifications };
  }
}
