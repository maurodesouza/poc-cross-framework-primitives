import type { Page } from "@playwright/test";
import { expectOutput } from "./output.ts";

/**
 * Waits until the scenario printed this submission (spec/checkbox.md, "Scenarios"): the form's
 * `FormData` as `key=value&...` in DOM order, `empty` for a submission with no entry, `none` when
 * nothing was submitted (a submission the browser's validation blocked).
 */
export async function expectSubmitted(
    page: Page,
    entries: string,
): Promise<void> {
    await expectOutput(page, "form", entries);
}
