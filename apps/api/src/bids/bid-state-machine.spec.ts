import { describe, it, expect } from "vitest";
import {
  assertBidTransition,
  bidContentsAreConfidential,
  type BidTransitionContext,
} from "./bid-state-machine.js";

/**
 * The bid state machine guards the confidential lifecycle: a bid's contents stay
 * sealed until an authorized opening, and the deadline/role rules must never be
 * bypassed. These tests lock those rules down.
 */

function ctx(overrides: Partial<BidTransitionContext> = {}): BidTransitionContext {
  return {
    acceptsSubmissions: true,
    deadlinePassed: false,
    hasBeenSubmitted: false,
    ...overrides,
  };
}

describe("assertBidTransition", () => {
  it("allows a bidder to submit a draft while submissions are open", () => {
    expect(() =>
      assertBidTransition("DRAFT", "SUBMITTED", "BIDDER", ctx()),
    ).not.toThrow();
  });

  it("rejects submission after the deadline", () => {
    expect(() =>
      assertBidTransition(
        "DRAFT",
        "SUBMITTED",
        "BIDDER",
        ctx({ acceptsSubmissions: false, deadlinePassed: true }),
      ),
    ).toThrowError(/deadline has passed/i);
  });

  it("rejects submission when the tender is not open (no deadline yet)", () => {
    expect(() =>
      assertBidTransition(
        "DRAFT",
        "SUBMITTED",
        "BIDDER",
        ctx({ acceptsSubmissions: false, deadlinePassed: false }),
      ),
    ).toThrowError(/not currently open/i);
  });

  it("rejects a no-op transition", () => {
    expect(() =>
      assertBidTransition("DRAFT", "DRAFT", "BIDDER", ctx()),
    ).toThrowError(/already/i);
  });

  it("rejects an undefined edge (DRAFT -> AWARDED)", () => {
    expect(() =>
      assertBidTransition("DRAFT", "AWARDED", "BIDDER", ctx()),
    ).toThrowError(/cannot move from/i);
  });

  it("blocks a bidder from opening their own bid (publisher only)", () => {
    expect(() =>
      assertBidTransition("SUBMITTED", "OPENED", "BIDDER", ctx()),
    ).toThrowError(/role/i);
  });

  it("allows a publisher to open a submitted bid", () => {
    expect(() =>
      assertBidTransition("SUBMITTED", "OPENED", "PUBLISHER", ctx()),
    ).not.toThrow();
  });

  it("allows withdrawing a submitted bid before the deadline", () => {
    expect(() =>
      assertBidTransition("SUBMITTED", "WITHDRAWN", "BIDDER", ctx()),
    ).not.toThrow();
  });

  it("rejects withdrawing a submitted bid after the deadline (seal is binding)", () => {
    expect(() =>
      assertBidTransition(
        "SUBMITTED",
        "WITHDRAWN",
        "BIDDER",
        ctx({ deadlinePassed: true }),
      ),
    ).toThrowError(/deadline has passed/i);
  });

  it("blocks a publisher from awarding directly (admin approves)", () => {
    expect(() =>
      assertBidTransition("RECOMMENDED", "AWARDED", "PUBLISHER", ctx()),
    ).toThrowError(/role/i);
  });

  it("allows an admin to award a recommended bid", () => {
    expect(() =>
      assertBidTransition("RECOMMENDED", "AWARDED", "ADMIN", ctx()),
    ).not.toThrow();
  });
});

describe("bidContentsAreConfidential", () => {
  it("keeps contents confidential until opened", () => {
    expect(bidContentsAreConfidential("DRAFT")).toBe(true);
    expect(bidContentsAreConfidential("SUBMITTED")).toBe(true);
    expect(bidContentsAreConfidential("WITHDRAWN")).toBe(true);
  });

  it("releases confidentiality once opened for evaluation", () => {
    expect(bidContentsAreConfidential("OPENED")).toBe(false);
    expect(bidContentsAreConfidential("UNDER_EVALUATION")).toBe(false);
    expect(bidContentsAreConfidential("EVALUATED")).toBe(false);
  });
});
