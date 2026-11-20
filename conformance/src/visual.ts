import { expect, type Page, test } from "@playwright/test";

/**
 * The visual layer runs in CI's Playwright image only (or with VISUAL=1): the golden set is made
 * there, and local fonts render differently (conformance/README.md, "Golden screenshots").
 */
export function visualOnlyInCi(): void {
    test.skip(
        !process.env.CI && !process.env.VISUAL,
        "the visual layer runs in CI's Playwright image (set VISUAL=1 to run it here)",
    );
}

/** Compares the viewport with the golden screenshot, with the pointer parked out of the way. */
export async function expectScreen(page: Page, name: string): Promise<void> {
    await page.mouse.move(0, 0);
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot(`${name}.png`);
}
