import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

/** Fails on any WCAG 2.1 A/AA violation in the page as it is now. */
export async function expectNoAxeViolations(page: Page): Promise<void> {
    const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
    expect(
        results.violations.map(
            (violation) =>
                `${violation.id}: ${violation.nodes.map((node) => node.target.join(" ")).join(", ")}`,
        ),
    ).toEqual([]);
}
