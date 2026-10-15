import { describe, it, expect } from "vitest";
import {
  assertTransition,
  acceptsSubmissions,
  availableTransitions,
  PUBLIC_STATUSES,
  EDITABLE_STATUSES,
  type TransitionContext,
} from "./tender-state-machine.js";

/**
 * The tender state machine is the single gate through which every lifecycle
 * change passes, so its rules are locked down here: an invalid transition must
 * never silently succeed, and the role/precondition guards must hold.
 */

function makeContext(overrides: Partial<TransitionContext> = {}): TransitionContext {
  return {
    now: new Date("2026-06-01T00:00:00.000Z"),
    hasSubmissionDeadline: true,
    deadlinePassed: false,
    organizationVerified: true,
    hasEvaluationCriteria: true,
    hasRequiredFields: true,
    datesAreCoherent: true,
    weightsAreValid: true,
    ...overrides,
  };
}

describe("assertTransition", () => {
  it("allows DRAFT -> PENDING_APPROVAL for a publisher when preconditions hold", () => {
    expect(() =>
      assertTransition("DRAFT", "PENDING_APPROVAL", "PUBLISHER", makeContext()),
    ).not.toThrow();
  });

  it("rejects a no-op transition (same state) with a conflict", () => {
    expect(() =>
      assertTransition("DRAFT", "DRAFT", "PUBLISHER", makeContext()),
    ).toThrowError(/already/i);
  });

  it("rejects an undefined edge (DRAFT -> AWARDED)", () => {
    expect(() =>
      assertTransition("DRAFT", "AWARDED", "PUBLISHER", makeContext()),
    ).toThrowError(/cannot move from/i);
  });

  it("submit-for-approval only requires the basic fields, not full publish gates", () => {
    // PENDING_APPROVAL is a lightweight internal step; the heavy validation
    // (verification, criteria, dates, weights) gates the PUBLISH edge instead.
    expect(() =>
      assertTransition(
        "DRAFT",
        "PENDING_APPROVAL",
        "PUBLISHER",
        makeContext({ organizationVerified: false, hasEvaluationCriteria: false }),
      ),
    ).not.toThrow();
    // ...but a draft missing its basic fields still cannot be submitted.
    expect(() =>
      assertTransition(
        "DRAFT",
        "PENDING_APPROVAL",
        "PUBLISHER",
        makeContext({ hasRequiredFields: false }),
      ),
    ).toThrowError(/title, description and category/i);
  });

  it("blocks DRAFT -> PUBLISHED when the organization is unverified", () => {
    expect(() =>
      assertTransition(
        "DRAFT",
        "PUBLISHED",
        "PUBLISHER",
        makeContext({ organizationVerified: false }),
      ),
    ).toThrowError(/verified/i);
  });

  it("blocks DRAFT -> PUBLISHED when there are no evaluation criteria", () => {
    expect(() =>
      assertTransition(
        "DRAFT",
        "PUBLISHED",
        "PUBLISHER",
        makeContext({ hasEvaluationCriteria: false }),
      ),
    ).toThrowError(/criteri/i);
  });

  it("blocks DRAFT -> PUBLISHED when weighted-scoring weights are invalid", () => {
    expect(() =>
      assertTransition(
        "DRAFT",
        "PUBLISHED",
        "PUBLISHER",
        makeContext({ weightsAreValid: false }),
      ),
    ).toThrowError(/weight/i);
  });

  it("blocks a role that lacks permission (MEMBER publishing)", () => {
    expect(() =>
      assertTransition("DRAFT", "PENDING_APPROVAL", "MEMBER", makeContext()),
    ).toThrowError(/role/i);
  });

  it("allows PUBLISHED -> OPEN_FOR_SUBMISSION for an owner", () => {
    expect(() =>
      assertTransition("PUBLISHED", "OPEN_FOR_SUBMISSION", "OWNER", makeContext()),
    ).not.toThrow();
  });

  it("permits cancelling a published tender with a reason", () => {
    expect(() =>
      assertTransition("PUBLISHED", "CANCELLED", "OWNER", makeContext()),
    ).not.toThrow();
  });
});

describe("acceptsSubmissions", () => {
  it("is true only while open and before the deadline", () => {
    expect(acceptsSubmissions("OPEN_FOR_SUBMISSION", false)).toBe(true);
    expect(acceptsSubmissions("OPEN_FOR_SUBMISSION", true)).toBe(false);
    expect(acceptsSubmissions("SUBMISSION_CLOSED", false)).toBe(false);
    expect(acceptsSubmissions("DRAFT", false)).toBe(false);
  });
});

describe("availableTransitions", () => {
  it("returns the drafting edges from DRAFT", () => {
    const targets = availableTransitions("DRAFT").map((rule) => rule.to);
    expect(targets).toContain("PENDING_APPROVAL");
    expect(targets).not.toContain("AWARDED");
  });

  it("returns nothing from a terminal state", () => {
    expect(availableTransitions("ARCHIVED")).toHaveLength(0);
  });
});

describe("status sets", () => {
  it("treats published states as public and drafts as private", () => {
    expect(PUBLIC_STATUSES).toContain("OPEN_FOR_SUBMISSION");
    expect(PUBLIC_STATUSES).not.toContain("DRAFT");
  });

  it("only allows editing in drafting states", () => {
    expect(EDITABLE_STATUSES).toContain("DRAFT");
    expect(EDITABLE_STATUSES).not.toContain("PUBLISHED");
  });
});
