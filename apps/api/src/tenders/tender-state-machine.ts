import { TenderStatus } from "@chereta/contracts";
import { AppException } from "../common/errors/app.exception.js";
import { ErrorCode } from "../common/errors/error-codes.js";

/**
 * The tender lifecycle, defined in one place.
 *
 * Every transition in the application goes through `assertTransition`, so the
 * rules cannot drift between the publish endpoint, the scheduler and any future
 * batch job. A tender can never move backwards except through the explicit
 * documented routes, and no code path can invent a status change.
 */

/** Roles allowed to trigger each transition. */
export type TenderTransitionRole =
  | "OWNER"
  | "ADMIN"
  | "PUBLISHER"
  /** A plain member: valid as an actor, but no transition permits this role. */
  | "MEMBER"
  | "EVALUATOR"
  | "PLATFORM_ADMIN";

export interface TransitionContext {
  /** Current server time — always from the application, never the request. */
  now: Date;
  /** True when the tender has a submission deadline set. */
  hasSubmissionDeadline: boolean;
  /** True when the deadline has already passed. */
  deadlinePassed: boolean;
  /** True when the procuring organization is verified. */
  organizationVerified: boolean;
  /** True when at least one evaluation criterion exists. */
  hasEvaluationCriteria: boolean;
  /** True when the tender has a title, description and category. */
  hasRequiredFields: boolean;
  /** True when the deadline ordering is coherent. */
  datesAreCoherent: boolean;
  /** True when weighted scoring is enabled and weights sum to 100. */
  weightsAreValid: boolean;
}

interface TransitionRule {
  to: TenderStatus;
  /** Roles permitted to perform this transition. */
  roles: TenderTransitionRole[];
  /** Preconditions; the first failure becomes the error message. */
  requires: (context: TransitionContext) => string | null;
  description: string;
}

/**
 * The allowed transitions, keyed by the state they leave.
 *
 * DRAFT and PENDING_APPROVAL are the drafting states; everything from
 * PUBLISHED onwards is externally visible and carries audit obligations.
 */
const TRANSITIONS: Record<TenderStatus, TransitionRule[]> = {
  DRAFT: [
    {
      to: "PENDING_APPROVAL",
      roles: ["OWNER", "ADMIN", "PUBLISHER"],
      requires: (c) =>
        c.hasRequiredFields
          ? null
          : "A tender needs a title, description and category before it can be submitted",
      description: "Submit a complete draft for organizational approval",
    },
    {
      to: "PUBLISHED",
      roles: ["OWNER", "ADMIN", "PUBLISHER"],
      requires: (c) => {
        if (!c.hasRequiredFields) return "A tender needs a title, description and category before publication";
        if (!c.organizationVerified) {
          return "Only a verified organization can publish tenders";
        }
        if (!c.hasEvaluationCriteria) {
          return "At least one evaluation criterion must be configured before publication";
        }
        if (!c.datesAreCoherent) {
          return "Tender dates are inconsistent; check the deadline ordering";
        }
        if (!c.weightsAreValid) {
          return "Evaluation criterion weights must sum to 100 when weighted scoring is enabled";
        }
        return null;
      },
      description: "Publish a validated tender",
    },
    {
      to: "CANCELLED",
      roles: ["OWNER", "ADMIN", "PUBLISHER"],
      requires: () => null,
      description: "Cancel an unpublished tender",
    },
  ],
  PENDING_APPROVAL: [
    {
      to: "PUBLISHED",
      roles: ["OWNER", "ADMIN"],
      requires: (c) => {
        if (!c.hasRequiredFields) return "A tender needs a title, description and category before publication";
        if (!c.organizationVerified) {
          return "Only a verified organization can publish tenders";
        }
        if (!c.hasEvaluationCriteria) {
          return "At least one evaluation criterion must be configured before publication";
        }
        if (!c.datesAreCoherent) {
          return "Tender dates are inconsistent; check the deadline ordering";
        }
        if (!c.weightsAreValid) {
          return "Evaluation criterion weights must sum to 100 when weighted scoring is enabled";
        }
        return null;
      },
      description: "Approve and publish",
    },
    {
      to: "DRAFT",
      roles: ["OWNER", "ADMIN", "PUBLISHER"],
      requires: () => null,
      description: "Return to draft for correction",
    },
    {
      to: "CANCELLED",
      roles: ["OWNER", "ADMIN"],
      requires: () => null,
      description: "Cancel a tender awaiting approval",
    },
  ],
  PUBLISHED: [
    {
      to: "OPEN_FOR_SUBMISSION",
      roles: ["OWNER", "ADMIN", "PUBLISHER"],
      requires: (c) =>
        c.hasSubmissionDeadline
          ? null
          : "A submission deadline must be set before submissions can open",
      description: "Open the tender for submissions",
    },
    {
      to: "CANCELLED",
      roles: ["OWNER", "ADMIN"],
      requires: () => null,
      description: "Cancel a published tender (requires a reason)",
    },
    {
      to: "ARCHIVED",
      roles: ["OWNER", "ADMIN"],
      requires: () => null,
      description: "Archive a published tender that never opened",
    },
  ],
  OPEN_FOR_SUBMISSION: [
    {
      to: "SUBMISSION_CLOSED",
      roles: ["OWNER", "ADMIN", "PUBLISHER"],
      requires: (c) =>
        c.deadlinePassed
          ? null
          : "The submission deadline must have passed before submissions close",
      description: "Close submissions at the deadline",
    },
    {
      to: "CANCELLED",
      roles: ["OWNER", "ADMIN"],
      requires: () => null,
      description: "Cancel an open tender (requires a reason)",
    },
  ],
  SUBMISSION_CLOSED: [
    {
      to: "OPENING_IN_PROGRESS",
      roles: ["OWNER", "ADMIN", "PUBLISHER"],
      requires: () => null,
      description: "Begin the confidential bid-opening process",
    },
    {
      to: "OPEN_FOR_SUBMISSION",
      roles: ["OWNER", "ADMIN"],
      // Reopening after close is a deliberate act, not an accident: it is only
      // permitted through an amendment that extends the deadline.
      requires: () =>
        "Submissions cannot be reopened except through an approved deadline amendment",
      description: "Reopen submissions (amendment only)",
    },
  ],
  OPENING_IN_PROGRESS: [
    {
      to: "UNDER_EVALUATION",
      roles: ["OWNER", "ADMIN"],
      requires: () => null,
      description: "Complete opening and begin evaluation",
    },
  ],
  UNDER_EVALUATION: [
    {
      to: "AWARDED",
      roles: ["OWNER", "ADMIN"],
      requires: () => null,
      description: "Record the award decision",
    },
    {
      to: "CANCELLED",
      roles: ["OWNER", "ADMIN"],
      requires: () => null,
      description: "Cancel a tender under evaluation (requires a reason)",
    },
  ],
  AWARDED: [
    {
      to: "ARCHIVED",
      roles: ["OWNER", "ADMIN"],
      requires: () => null,
      description: "Archive a completed tender",
    },
  ],
  CANCELLED: [
    {
      to: "ARCHIVED",
      roles: ["OWNER", "ADMIN"],
      requires: () => null,
      description: "Archive a cancelled tender",
    },
  ],
  ARCHIVED: [],
};

/** Statuses that are visible to the public. */
export const PUBLIC_STATUSES: readonly TenderStatus[] = [
  "PUBLISHED",
  "OPEN_FOR_SUBMISSION",
  "SUBMISSION_CLOSED",
  "AWARDED",
] as const;

/** Statuses where a tender may still be edited as a draft. */
export const EDITABLE_STATUSES: readonly TenderStatus[] = ["DRAFT", "PENDING_APPROVAL"] as const;

/**
 * Returns the transitions available from a status, for documentation and for
 * the organization dashboard's action list.
 */
export function availableTransitions(from: TenderStatus): TransitionRule[] {
  return TRANSITIONS[from] ?? [];
}

/**
 * Asserts that a transition is legal, that the actor may perform it, and that
 * every precondition holds. Throws a 409 with a specific message otherwise.
 *
 * SECURITY: this is the single gate for status changes. An endpoint that
 * mutates `tender.status` without calling this is a bug.
 */
export function assertTransition(
  from: TenderStatus,
  to: TenderStatus,
  actorRole: TenderTransitionRole,
  context: TransitionContext,
): void {
  if (from === to) {
    throw new AppException(
      ErrorCode.CONFLICT,
      `Tender is already ${describeStatus(from)}.`,
      409,
    );
  }

  const rule = TRANSITIONS[from]?.find((candidate) => candidate.to === to);
  if (!rule) {
    throw new AppException(
      ErrorCode.INVALID_STATE_TRANSITION,
      `A tender cannot move from ${describeStatus(from)} to ${describeStatus(to)}.`,
      409,
    );
  }

  if (!rule.roles.includes(actorRole)) {
    throw new AppException(
      ErrorCode.INSUFFICIENT_ORGANIZATION_ROLE,
      `Your organization role does not allow ${rule.description.toLowerCase()}.`,
      403,
    );
  }

  const problem = rule.requires(context);
  if (problem) {
    throw new AppException(ErrorCode.INVALID_STATE_TRANSITION, problem, 409);
  }
}

/** True when submissions are still accepted for a tender. */
export function acceptsSubmissions(status: TenderStatus, deadlinePassed: boolean): boolean {
  return status === "OPEN_FOR_SUBMISSION" && !deadlinePassed;
}

function describeStatus(status: TenderStatus): string {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
