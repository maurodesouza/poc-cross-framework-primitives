import { expect, type Locator, type Page, test } from "@playwright/test";
import { expectNoAxeViolations } from "../../src/axe.ts";
import { baselineDeviation } from "../../src/deviation.ts";
import { expectOutput } from "../../src/output.ts";
import { openScenario } from "../../src/scenario.ts";

// spec/tooltip.md. Delays run on the real clock: a test asserts the tooltip is hidden right after
// the hover, then measures how long it took to appear (a lower bound, never a sleep).
const button = (page: Page, name: string) =>
    page.getByRole("button", { name, exact: true });
const tooltip = (page: Page, name: string) =>
    page.getByRole("tooltip", { name });

async function hover(page: Page, target: Locator) {
    const box = await target.boundingBox();
    expect(box).not.toBeNull();
    const { x, y, width, height } = box as NonNullable<typeof box>;
    await page.mouse.move(
        Math.round(x + width / 2),
        Math.round(y + height / 2),
        {
            steps: 2,
        },
    );
}

/** Hovers `target`, checks nothing shows at once, and returns the ms until `shown` is visible. */
async function msUntilShown(page: Page, target: Locator, shown: Locator) {
    const start = Date.now();
    await hover(page, target);
    await expect(shown).toBeHidden();
    await expect(shown).toBeVisible({ timeout: 5000 });
    return Date.now() - start;
}

test.describe("tooltip / basic", () => {
    test.beforeEach(async ({ page }) => {
        await openScenario(page, "/tooltip/basic");
    });

    test("hover opens it after the delay and describes the trigger", async ({
        page,
    }) => {
        baselineDeviation(
            "Base UI's tooltip trigger has no aria-describedby (spec/tooltip.md, Baseline deviations)",
        );
        const save = button(page, "Save");
        await expect(page.getByRole("tooltip")).toHaveCount(0);
        await expect(save).not.toHaveAccessibleDescription(/./);
        const elapsed = await msUntilShown(
            page,
            save,
            tooltip(page, "Save the document"),
        );
        expect(elapsed).toBeGreaterThanOrEqual(450);
        await expect(save).toHaveAccessibleDescription("Save the document");
        await expectOutput(page, "reason", "trigger-hover");
    });

    test("the popup is hoverable; leaving both closes it", async ({ page }) => {
        const popup = tooltip(page, "Save the document");
        await msUntilShown(page, button(page, "Save"), popup);
        await hover(page, popup);
        await expect(popup).toBeVisible();
        await page.mouse.move(400, 300, { steps: 2 });
        await expect(popup).toBeHidden();
        await expectOutput(page, "open", "false");
        await expectOutput(page, "reason", "trigger-hover");
    });

    test("keyboard focus opens it at once; Escape closes it and keeps focus", async ({
        page,
    }) => {
        await button(page, "Before").focus();
        await page.keyboard.press("Tab");
        await expect(button(page, "Save")).toBeFocused();
        await expect(tooltip(page, "Save the document")).toBeVisible({
            timeout: 400,
        });
        await expectOutput(page, "reason", "trigger-focus");
        await page.keyboard.press("Escape");
        await expect(page.getByRole("tooltip")).toHaveCount(0);
        await expectOutput(page, "reason", "escape-key");
        await expect(button(page, "Save")).toBeFocused();
        await page.keyboard.press("Shift+Tab");
        await expect(button(page, "Before")).toBeFocused();
        await expect(page.getByRole("tooltip")).toHaveCount(0);
    });

    test("a press on the trigger closes it, and it stays closed", async ({
        page,
    }) => {
        const popup = tooltip(page, "Save the document");
        await msUntilShown(page, button(page, "Save"), popup);
        await page.mouse.down();
        await page.mouse.up();
        await expect(popup).toBeHidden();
        await expectOutput(page, "reason", "trigger-press");
        // past the delay, with the pointer still on the trigger
        await page.waitForTimeout(800);
        await expect(page.getByRole("tooltip")).toHaveCount(0);
    });

    test("has no axe violation while open", async ({ page }) => {
        await msUntilShown(
            page,
            button(page, "Save"),
            tooltip(page, "Save the document"),
        );
        await expectNoAxeViolations(page);
    });
});

test.describe("tooltip / basic, touch", () => {
    test.use({ hasTouch: true });

    test("a tap shows no tooltip", async ({ page }) => {
        await openScenario(page, "/tooltip/basic");
        const box = await button(page, "Save").boundingBox();
        expect(box).not.toBeNull();
        const { x, y, width, height } = box as NonNullable<typeof box>;
        await page.touchscreen.tap(x + width / 2, y + height / 2);
        // past the delay
        await page.waitForTimeout(800);
        await expect(page.getByRole("tooltip")).toHaveCount(0);
    });
});

test.describe("tooltip / group", () => {
    test.beforeEach(async ({ page }) => {
        await openScenario(page, "/tooltip/group");
    });

    test("the first tooltip waits for the delay", async ({ page }) => {
        const elapsed = await msUntilShown(
            page,
            button(page, "Bold"),
            tooltip(page, "Bold (Ctrl+B)"),
        );
        expect(elapsed).toBeGreaterThanOrEqual(700);
    });

    test("moving to another trigger hands off at once", async ({ page }) => {
        await msUntilShown(
            page,
            button(page, "Bold"),
            tooltip(page, "Bold (Ctrl+B)"),
        );
        const start = Date.now();
        await hover(page, button(page, "Italic"));
        await expect(tooltip(page, "Italic (Ctrl+I)")).toBeVisible({
            timeout: 400,
        });
        expect(Date.now() - start).toBeLessThan(400);
        await expect(tooltip(page, "Bold (Ctrl+B)")).toBeHidden();
        await expect(page.getByRole("tooltip")).toHaveCount(1);
    });

    test("after the timeout, the next one waits for the delay again", async ({
        page,
    }) => {
        await msUntilShown(
            page,
            button(page, "Bold"),
            tooltip(page, "Bold (Ctrl+B)"),
        );
        await hover(page, button(page, "Elsewhere"));
        await expect(page.getByRole("tooltip")).toHaveCount(0);
        // past the group's timeout (400 ms)
        await page.waitForTimeout(1000);
        await expect(page.getByRole("tooltip")).toHaveCount(0);
        const elapsed = await msUntilShown(
            page,
            button(page, "Underline"),
            tooltip(page, "Underline (Ctrl+U)"),
        );
        expect(elapsed).toBeGreaterThanOrEqual(700);
    });
});
