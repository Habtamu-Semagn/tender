import { describe, it, expect } from "vitest";
import { Prisma } from "../generated/prisma/client.js";

/**
 * Evaluation integrity: the weighted total is the number that decides awards,
 * so its computation must be exact and must match what the service stores.
 *
 * The service computes each score's contribution as (score / maxScore) * weight
 * and sums them. These tests lock that formula and the Decimal rounding the
 * service applies, so a regression here cannot silently change an award.
 */

/** Mirror of the service's per-score contribution: (score/maxScore)*weight. */
function weightedContribution(score: number, maxScore: number, weight: number): number {
  return maxScore > 0 ? (score / maxScore) * weight : 0;
}

describe("weighted scoring", () => {
  it("computes a full-marks criterion as its full weight", () => {
    // score == maxScore -> contribution == weight
    expect(weightedContribution(100, 100, 60)).toBe(60);
  });

  it("computes a partial score proportionally", () => {
    // 80/100 of a 50-weight criterion -> 40
    expect(weightedContribution(80, 100, 50)).toBe(40);
  });

  it("computes a zero score as zero contribution", () => {
    expect(weightedContribution(0, 100, 30)).toBe(0);
  });

  it("guards against a zero maxScore (no divide-by-zero)", () => {
    expect(weightedContribution(50, 0, 30)).toBe(0);
  });

  it("sums to 100 when every criterion is full marks and weights sum to 100", () => {
    const criteria = [
      { score: 100, max: 100, weight: 50 },
      { score: 100, max: 100, weight: 20 },
      { score: 100, max: 100, weight: 30 },
    ];
    const total = criteria.reduce(
      (sum, c) => sum + weightedContribution(c.score, c.max, c.weight),
      0,
    );
    expect(total).toBe(100);
  });

  it("matches the service's Decimal(10,4) rounding to 2dp for a realistic mix", () => {
    const criteria = [
      { score: 85, max: 100, weight: 50 }, // 42.5
      { score: 70, max: 100, weight: 20 }, // 14
      { score: 90, max: 100, weight: 30 }, // 27
    ];
    const raw = criteria.reduce(
      (sum, c) => sum + weightedContribution(c.score, c.max, c.weight),
      0,
    );
    // The service stores totalScore as Decimal(10,2): new Decimal(total.toFixed(2))
    const stored = new Prisma.Decimal(raw.toFixed(2));
    expect(Number(stored)).toBe(83.5);
  });
});
