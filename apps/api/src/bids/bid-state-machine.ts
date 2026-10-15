import type { BidStatus } from "@chereta/contracts";
import { AppException } from "../common/errors/app.exception.js";
import { ErrorCode } from "../common/errors/error-codes.js";

/**
 * Bid lifecycle state machine.
 *
 * Every status change a bid can undergo goes through `assertBidTransition`, so
 * the same rules apply whether the change is triggered by a bidder, a publisher,
 * or an evaluator. The confidential contents of a bid are only ever exposed
 * after the authorized opening transition, and this machine is the gate that
 * decides when that is legal.
 */

export type BidTransitionRole =
  | "BIDDER"
  | "PUBLISHER"
  | "EVALUATOR"
  | "ADMIN";

export interface BidTransitionContext {
  /** True when the tender still accepts submissions (server-evaluated). */
  acceptsSubmissions: boolean;
  /** True when the submission deadline has passed per server time. */
  deadlinePassed: boolean;
  /** True when the bid has at least one submitted revision. */
  hasBeenSubmitted: boolean;
}

interface BidTransitionRule {
  to: BidStatus;
  roles: BidTransitionRole[];
  requires: (context: BidTransitionContext) => string | null;
  description: string;
}

/**
 * Allowed transitions, keyed by the state they leave.
 *
 * DRAFT is the bidder's working copy. SUBMITTED is the sealed bid — from here
 * the contents are confidential until OPENED. WITHDRAWN is terminal for the
 * bidder but kept for audit. The evaluation/award states (OPENED onward) are
 * driven by the evaluation module, not by bidders.
 */
const TRANSITIONS: Record<BidStatus, BidTransitionRule[]> = {
  DRAFT: [
    {
      to: "SUBMITTED",
      roles: ["BIDDER"],
      requires: (c) =>
        c.acceptsSubmissions
          ? null
          : c.deadlinePassed
            ? "The submission deadline has passed; this bid can no longer be submitted."
            : "This tender is not currently open for submissions.",
      description: "Submit a sealed bid",
    },
    {
      to: "WITHDRAWN",
      roles: ["BIDDER"],
      requires: () => null,
      description: "Withdraw a draft before submission",
    },
  ],
  SUBMITTED: [
    {
      to: "WITHDRAWN",
      roles: ["BIDDER"],
      // A submitted bid may be withdrawn only while the tender is still open;
      // once the deadline passes the seal is binding for audit integrity.
      requires: (c) =>
        c.deadlinePassed
          ? "The submission deadline has passed; a submitted bid can no longer be withdrawn."
          : null,
      description: "Withdraw a submitted bid before the deadline",
    },
    {
      to: "OPENED",
      roles: ["PUBLISHER", "ADMIN"],
      requires: () => null,
      description: "Open a submitted bid for evaluation",
    },
  ],
  OPENED: [
    {
      to: "UNDER_EVALUATION",
      roles: ["EVALUATOR", "PUBLISHER", "ADMIN"],
      requires: () => null,
      description: "Move an opened bid into evaluation",
    },
  ],
  UNDER_EVALUATION: [
    {
      to: "EVALUATED",
      roles: ["EVALUATOR", "PUBLISHER", "ADMIN"],
      requires: () => null,
      description: "Complete evaluation of a bid",
    },
  ],
  EVALUATED: [
    {
      to: "RECOMMENDED",
      roles: ["PUBLISHER", "ADMIN"],
      requires: () => null,
      description: "Recommend an evaluated bid for award",
    },
    {
      to: "REJECTED",
      roles: ["PUBLISHER", "ADMIN"],
      requires: () => null,
      description: "Reject an evaluated bid",
    },
  ],
  RECOMMENDED: [
    {
      to: "AWARDED",
      roles: ["ADMIN"],
      requires: () => null,
      description: "Award a recommended bid",
    },
    {
      to: "REJECTED",
      roles: ["ADMIN"],
      requires: () => null,
      description: "Reject a recommended bid",
    },
  ],
  ACCEPTED: [],
  // Terminal / externally-set states carry no outgoing transitions here; their
  // changes are driven by the evaluation and award modules with their own
  // authorization, so the table intentionally leaves them empty.
  AWARDED: [],
  REJECTED: [],
  UNSUCCESSFUL: [],
  WITHDRAWN: [],
};

/**
 * Asserts that a bid may move from one status to another for the given role,
 * throwing a typed exception otherwise. Centralizing this means an illegal
 * transition can never slip through a controller that forgot to check.
 */
export function assertBidTransition(
  from: BidStatus,
  to: BidStatus,
  actorRole: BidTransitionRole,
  context: BidTransitionContext,
): void {
  if (from === to) {
    throw new AppException(
      ErrorCode.CONFLICT,
      `Bid is already ${describeBidStatus(from)}.`,
      409,
    );
  }

  const rule = TRANSITIONS[from]?.find((candidate) => candidate.to === to);
  if (!rule) {
    throw new AppException(
      ErrorCode.INVALID_STATE_TRANSITION,
      `A bid cannot move from ${describeBidStatus(from)} to ${describeBidStatus(to)}.`,
      409,
    );
  }

  if (!rule.roles.includes(actorRole)) {
    throw new AppException(
      ErrorCode.INSUFFICIENT_ORGANIZATION_ROLE,
      `Your role does not allow ${rule.description.toLowerCase()}.`,
      403,
    );
  }

  const problem = rule.requires(context);
  if (problem) {
    throw new AppException(ErrorCode.INVALID_STATE_TRANSITION, problem, 409);
  }
}

/** True when a bid's confidential contents may be read by the given status. */
export function bidContentsAreConfidential(status: BidStatus): boolean {
  // Contents stay confidential until the bid is opened for evaluation.
  return status === "DRAFT" || status === "SUBMITTED" || status === "WITHDRAWN";
}

function describeBidStatus(status: BidStatus): string {
  return status.toLowerCase().replace(/_/g, " ");
}
