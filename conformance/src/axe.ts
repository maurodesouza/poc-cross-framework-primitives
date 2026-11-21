import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

/**
 * Fails on any WCAG 2.1 A/AA violation in the page as it is now, once the running animations (an
 * overlay's enter transition) have finished: a half-faded popup has no stable contrast. The same
 * wait for every implementation.
 */
export async function expectNoAxeViolations(page: Page): Promise<void> {
    // An enter transition starts once the popup drops `data-starting-style`, which a framework
    // that renders in a later task (zoneless Angular) does a frame or two after the popup is
    // visible: wait for the frames, then for every running animation, until none is left.
    await page.evaluate(async () => {
        const frame = () =>
            new Promise((resolve) =>
                requestAnimationFrame(() => resolve(null)),
            );
        for (let round = 0; round < 10; round += 1) {
            await frame();
            await frame();
            const running = document.getAnimations();
            if (running.length === 0) {
                return;
            }
            await Promise.all(running.map((animation) => animation.finished));
        }
    });
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
