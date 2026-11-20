import { test } from "@playwright/test";

/**
 * Marks the current test as an expected failure **for the baseline only**, for a difference
 * between Base UI / React Aria and the spec that is recorded in the spec's "Baseline deviations"
 * section. The test is never weakened: every other implementation must pass it, and if the
 * baseline starts passing, Playwright reports the stale mark.
 */
export function baselineDeviation(reason: string): void {
    test.fail(test.info().project.name === "baseline", reason);
}
