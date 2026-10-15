import { describe, it, expect } from "vitest";

/**
 * Notification template-data contract.
 *
 * A real bug shipped once: notify* methods passed templateData under the wrong
 * keys (e.g. `title`/`referenceNumber`) while the templates interpolated
 * `tenderTitle`/`tenderReference`, so every tender email body rendered
 * "undefined". These tests pin the placeholder names each template reads, so a
 * future key rename in a template fails here instead of silently blanking an
 * email.
 *
 * The templates live in notification.service.ts as a private const, so this test
 * asserts the contract by reading the source and extracting the `${d.<key>}`
 * placeholders per notification type, then checking the keys each notify path is
 * expected to supply.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const src = readFileSync(
  fileURLToPath(new URL("./notification.service.ts", import.meta.url)),
  "utf8",
);

/** Extracts the `${d.<key>}` placeholders used inside a given template block. */
function placeholdersForType(type: string): string[] {
  // Find "TYPE: {" ... up to the matching "}," at column 0.
  const start = src.indexOf(`${type}: {`);
  if (start < 0) return [];
  const end = src.indexOf("\n  },", start);
  const block = src.slice(start, end < 0 ? undefined : end);
  const keys = new Set<string>();
  for (const match of block.matchAll(/\$\{d\.(\w+)\}/g)) {
    keys.add(match[1]);
  }
  return [...keys];
}

describe("notification template placeholders", () => {
  it("TENDER_PUBLISHED reads tenderTitle/tenderReference/submissionDeadline", () => {
    const keys = placeholdersForType("TENDER_PUBLISHED");
    expect(keys).toContain("tenderTitle");
    expect(keys).toContain("tenderReference");
    expect(keys).toContain("submissionDeadline");
  });

  it("TENDER_AMENDED reads tenderTitle/tenderReference/amendmentTitle", () => {
    const keys = placeholdersForType("TENDER_AMENDED");
    expect(keys).toContain("tenderTitle");
    expect(keys).toContain("tenderReference");
    expect(keys).toContain("amendmentTitle");
  });

  it("TENDER_CANCELLED reads tenderTitle/tenderReference", () => {
    const keys = placeholdersForType("TENDER_CANCELLED");
    expect(keys).toContain("tenderTitle");
    expect(keys).toContain("tenderReference");
  });

  it("AWARD_PUBLISHED reads tenderReference (and tenderTitle)", () => {
    const keys = placeholdersForType("AWARD_PUBLISHED");
    expect(keys).toContain("tenderReference");
  });

  it("the notify* call sites supply the keys their templates read", () => {
    // notifyTenderPublished/Cancelled must pass tenderTitle + tenderReference.
    expect(src).toContain("tenderTitle: tender.title");
    expect(src).toContain("tenderReference: tender.referenceNumber");
    // The old, wrong keys must be gone from the tender notify paths.
    expect(src).not.toContain("{ title: tender.title, referenceNumber: tender.referenceNumber }");
  });
});
