import { expect, type Page, test } from "@playwright/test";
import { expectNoAxeViolations } from "../../src/axe.ts";
import { baselineDeviation } from "../../src/deviation.ts";
import { expectFocusWithin } from "../../src/focus.ts";
import { expectOutput } from "../../src/output.ts";
import { openScenario } from "../../src/scenario.ts";

// spec/popover.md
const trigger = (page: Page) =>
    page.getByRole("button", { name: "Open popover" });
const popover = (page: Page) =>
    page.getByRole("dialog", { name: "Notifications" });

test.describe("popover / basic", () => {
    test.beforeEach(async ({ page }) => {
        await openScenario(page, "/popover/basic");
    });

    test("the trigger announces a dialog and its state", async ({ page }) => {
        await expect(trigger(page)).toHaveAttribute("aria-haspopup", "dialog");
        await expect(trigger(page)).toHaveAttribute("aria-expanded", "false");
        await trigger(page).click();
        await expect(trigger(page)).toHaveAttribute("aria-expanded", "true");
        const id = await popover(page).getAttribute("id");
        await expect(trigger(page)).toHaveAttribute(
            "aria-controls",
            id as string,
        );
    });

    test("opens a non-modal dialog and focuses it", async ({ page }) => {
        baselineDeviation(
            "Base UI's Popover focuses its first tabbable element, not the popup (spec/popover.md, Baseline deviations)",
        );
        await trigger(page).click();
        await expect(popover(page)).toBeVisible();
        await expect(popover(page)).not.toHaveAttribute("aria-modal", "true");
        await expect(popover(page)).toHaveAccessibleDescription(
            "You have 3 unread messages.",
        );
        await expect(popover(page)).toBeFocused();
    });

    test("Tab walks the content, then leaves to the next element and closes", async ({
        page,
    }) => {
        await trigger(page).click();
        await expectFocusWithin(popover(page));
        await page.getByRole("button", { name: "Mark all as read" }).focus();
        await page.keyboard.press("Tab");
        await expect(page.getByRole("button", { name: "Close" })).toBeFocused();
        await page.keyboard.press("Tab");
        await expect(
            page.getByRole("button", { name: "After trigger" }),
        ).toBeFocused();
        await expect(popover(page)).toBeHidden();
        await expectOutput(page, "reason", "focus-out");
    });

    test("Escape closes and focuses the trigger", async ({ page }) => {
        await trigger(page).click();
        await expect(popover(page)).toBeVisible();
        await page.keyboard.press("Escape");
        await expect(popover(page)).toBeHidden();
        await expectOutput(page, "reason", "escape-key");
        await expect(trigger(page)).toBeFocused();
    });

    test("an outside press closes without moving focus to the trigger", async ({
        page,
    }) => {
        baselineDeviation(
            "Base UI's Popover returns focus to the trigger after an outside press (spec/popover.md, Baseline deviations)",
        );
        await trigger(page).click();
        await expect(popover(page)).toBeVisible();
        await page.getByTestId("output").click();
        await expect(popover(page)).toBeHidden();
        await expectOutput(page, "reason", "outside-press");
        await expect(trigger(page)).not.toBeFocused();
    });

    test("pressing the trigger while open closes it for good", async ({
        page,
    }) => {
        await trigger(page).click();
        await expect(popover(page)).toBeVisible();
        await trigger(page).click();
        await expect(popover(page)).toBeHidden();
        await expectOutput(page, "reason", "trigger-press");
        await page.waitForTimeout(300);
        await expect(popover(page)).toBeHidden();
    });

    test("has no axe violation while open", async ({ page }) => {
        await trigger(page).click();
        await expect(popover(page)).toBeVisible();
        await expectNoAxeViolations(page);
    });
});

async function openPlaced(page: Page, label: string) {
    const button = page.getByRole("button", { name: label });
    await button.click();
    const popup = page.getByRole("dialog", { name: "Placed" });
    await expect(popup).toBeVisible();
    const triggerBox = await button.boundingBox();
    const popupBox = await popup.boundingBox();
    if (triggerBox === null || popupBox === null) {
        throw new Error("missing boxes");
    }
    return { triggerBox, popupBox };
}

test.describe("popover / placement", () => {
    test.beforeEach(async ({ page }) => {
        await openScenario(page, "/popover/placement");
    });

    test("bottom start: below the trigger, start edges aligned", async ({
        page,
    }) => {
        const { triggerBox, popupBox } = await openPlaced(page, "Bottom start");
        expect(popupBox.y).toBeGreaterThanOrEqual(
            triggerBox.y + triggerBox.height - 1,
        );
        expect(Math.abs(popupBox.x - triggerBox.x)).toBeLessThanOrEqual(1);
    });

    test("end: to the right of the trigger in LTR", async ({ page }) => {
        const { triggerBox, popupBox } = await openPlaced(page, "End");
        expect(popupBox.x).toBeGreaterThanOrEqual(
            triggerBox.x + triggerBox.width - 1,
        );
    });

    test("flip: above the trigger when there is no room below", async ({
        page,
    }) => {
        const { triggerBox, popupBox } = await openPlaced(page, "Flip");
        expect(popupBox.y + popupBox.height).toBeLessThanOrEqual(
            triggerBox.y + 1,
        );
    });
});

test("popover / rtl: end is to the left of the trigger", async ({ page }) => {
    await openScenario(page, "/popover/rtl", { dir: "rtl" });
    const { triggerBox, popupBox } = await openPlaced(page, "End");
    expect(popupBox.x + popupBox.width).toBeLessThanOrEqual(triggerBox.x + 1);
});

test("popover / arrow: points at the trigger", async ({ page }) => {
    await openScenario(page, "/popover/arrow");
    const button = page.getByRole("button", { name: "With arrow" });
    await button.click();
    await expect(page.getByRole("dialog", { name: "Arrow" })).toBeVisible();
    const triggerBox = await button.boundingBox();
    const arrowBox = await page.getByTestId("arrow").boundingBox();
    if (triggerBox === null || arrowBox === null) {
        throw new Error("missing boxes");
    }
    const centre = arrowBox.x + arrowBox.width / 2;
    expect(centre).toBeGreaterThanOrEqual(triggerBox.x - 2);
    expect(centre).toBeLessThanOrEqual(triggerBox.x + triggerBox.width + 2);
});
