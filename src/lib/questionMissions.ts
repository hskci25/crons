import { questionKind, type QuestionKind } from "./questionDisplay";
import type { Question } from "./types/questions";

export interface QuestionMission {
  summary: string;
  steps: string[];
}

/** Per-challenge mission copy shown in the workspace sidebar and cards. */
export const QUESTION_MISSIONS: Record<string, QuestionMission> = {
  "pair-match-service": {
    summary:
      "Implement `findPairIndices` to return the indices of two numbers in the array that add up to `targetSum`. The starter always returns `{0, 0}` — tests expect the correct pair (order matters).",
    steps: [
      "Open `PairMatchServiceTest` and note sample inputs (e.g. `[2,7,11,15]` + target `9` → `[0,1]`).",
      "Use a hash map to store value → index while scanning, or check complements in one pass.",
      "Handle duplicates and negatives — hidden tests cover those edge cases.",
    ],
  },
  "inventory-reservation-service": {
    summary:
      "Fix `reserve` and `available` so stock is decremented when a reservation succeeds and rejected when there isn’t enough inventory. The current code never updates the map and uses the wrong comparison.",
    steps: [
      "Run tests and watch `available` after a successful `reserve` — it should drop by the reserved quantity.",
      "Reject unknown SKUs and quantities greater than on-hand stock (including exact depletion).",
      "After fixing, reserving the last unit should leave `available` at 0 and block further reserves.",
    ],
  },
  "rate-limiter-service": {
    summary:
      "Fix `allowRequest()` so at most `maxRequests` calls return `true`, then further calls return `false` until `reset()`. The bug allows one extra request past the limit.",
    steps: [
      "Read `RateLimiterServiceTest` — with limit 3 you should get three `true` then `false`.",
      "Check the boundary: compare count against the limit before or after incrementing.",
      "Confirm `reset()` clears state so the limit applies again from zero.",
    ],
  },
  "password-strength-service": {
    summary:
      "Fix `isStrong` so a password is strong only when length ≥ 8 and it contains at least one uppercase letter, one lowercase letter, and one digit. Right now any 8+ character string passes.",
    steps: [
      "Inspect failing tests — short passwords and missing character classes should return `false`.",
      "Scan characters once (or use simple checks) for upper, lower, and digit.",
      "Null or short passwords should fail without throwing.",
    ],
  },
  "pagination-service": {
    summary:
      "Fix `page(items, page, pageSize)` for **1-based** pages. The starter uses the wrong start index, so page 1 skips the first items and page 2 is misaligned.",
    steps: [
      "Page 1 with `pageSize` 2 on five items should return the first two elements.",
      "Start index should be `(page - 1) * pageSize`, not `page * pageSize`.",
      "Return an empty list for out-of-range pages or invalid `page` / `pageSize`.",
    ],
  },
  "csv-parser-service": {
    summary:
      "Fix `parseLine` to split CSV fields correctly when values contain commas inside double quotes (e.g. `\"world,again\"`). A plain `String.split(\",\")` breaks those rows.",
    steps: [
      "Walk the line character by character, tracking whether you’re inside quotes.",
      "Only treat commas as delimiters when not inside quotes; strip surrounding quotes from fields.",
      "Empty lines should return an empty list; simple unquoted rows should still work.",
    ],
  },
  "discount-calculator-service": {
    summary:
      "Implement `applyDiscountCents`: no discount under $50 (5000¢), 10% off from $50–$99.99, 20% off at $100+. Return the discounted total in cents (rounded). Reject negative subtotals.",
    steps: [
      "Read the Javadoc on `DiscountCalculatorService` and the assertions in `DiscountCalculatorServiceTest`.",
      "Branch on `subtotalCents` thresholds — use `Math.round` for the final cent amount.",
      "Hidden tests cover the $100 tier and negative input.",
    ],
  },
  "user-search-service": {
    summary:
      "Implement `findByPrefix` over the built-in user list: case-insensitive prefix match, results sorted alphabetically. Empty prefix should return no matches.",
    steps: [
      "Lowercase both the prefix and each username before `startsWith`.",
      "Collect matches in a list, then sort before returning.",
      "Use the static `USERS` list in the service — don’t hard-code test expectations.",
    ],
  },
  "notification-router-service": {
    summary:
      "Implement `route(preferredChannel)`: return the trimmed, lowercased channel when provided; if null or blank, default to `\"email\"`.",
    steps: [
      "Check for null, empty, or whitespace-only input first.",
      "Normalize valid channels with `trim()` and `toLowerCase()`.",
      "Visible tests cover blank vs explicit `\"sms\"`; hidden tests cover padded input like `\"  PUSH  \"`.",
    ],
  },
  "order-total-service": {
    summary:
      "Implement `totalWithTaxCents` to add **8% tax** to `subtotalCents` and return the total in cents (rounded). Zero subtotal → 0; negative values should throw.",
    steps: [
      "Multiply subtotal by `1.08` (or subtotal + 8% tax) and round to the nearest long.",
      "Example: 1000¢ subtotal → 1080¢ total.",
      "Hidden tests check rounding on awkward amounts and invalid negative input.",
    ],
  },
  "audit-query-service": {
    summary:
      "Implement `eventIdsBetween(from, to)` to return event IDs whose dates fall in the **inclusive** range `[from, to]`. Events are preloaded in the service; invalid ranges return empty.",
    steps: [
      "Loop `EVENTS`, compare each `LocalDate` with `!day.isBefore(from) && !day.isAfter(to)`.",
      "Preserve insertion order from the static list (e1, e2, e3).",
      "Return empty for null dates or when `from` is after `to`.",
    ],
  },
};

function genericMission(kind: QuestionKind): QuestionMission {
  if (kind === "debugging") {
    return {
      summary:
        "Production code has regressions — use tests and the service class to find what’s wrong, then fix it until all cases pass.",
      steps: [
        "Read visible tests to learn expected behavior and edge cases.",
        "Compare failing assertions with the current implementation — look for off-by-one, missing updates, or wrong conditions.",
        "Run tests after each fix; hidden cases run server-side on every run.",
      ],
    };
  }
  if (kind === "feature") {
    return {
      summary:
        "Core logic is stubbed out — implement the service methods so visible and hidden tests pass.",
      steps: [
        "Read tests and Javadoc to understand the API contract.",
        "Replace `throw new UnsupportedOperationException` (or stubs) in the service class.",
        "Run tests iteratively; hidden cases are included in the runner output.",
      ],
    };
  }
  return {
    summary:
      "No written spec — infer requirements from the repo layout, readonly code, and test assertions.",
    steps: [
      "Explore the file tree and open readonly tests first.",
      "Identify which file is editable (usually `*Service.java`).",
      "Implement until all tests pass, then submit.",
    ],
  };
}

export function getQuestionMission(
  slug: string,
  tags: string[],
): QuestionMission {
  return QUESTION_MISSIONS[slug] ?? genericMission(questionKind(tags));
}

export function questionSummary(q: Question | { tags: string[]; slug?: string }): string {
  if (q.slug) {
    return getQuestionMission(q.slug, q.tags).summary;
  }
  return genericMission(questionKind(q.tags)).summary;
}
