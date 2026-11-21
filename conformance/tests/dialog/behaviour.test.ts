import { expect, test } from "@playwright/test";
import { expectNoAxeViolations } from "../../src/axe.ts";
import { baselineDeviation } from "../../src/deviation.ts";
import { isInertOrHidden } from "../../src/focus.ts";
import { expectOutput } from "../../src/output.ts";
import { openScenario } from "../../src/scenario.ts";

// spec/dialog.md
test.describe("dialog / basic", () => {
    test.beforeEach(async ({ page }) => {
        await openScenario(page, "/dialog/basic");
    });

    const trigger = (page: import("@playwright/test").Page) =>
        page.getByRole("button", { name: "Open dialog", includeHidden: true });
    const dialog = (page: import("@playwright/test").Page) =>
        page.getByRole("dialog", { name: "Edit profile" });

    test("the trigger announces a dialog and its state", async ({ page }) => {
        await expect(trigger(page)).toHaveAttribute("aria-haspopup", "dialog");
        await expect(trigger(page)).toHaveAttribute("aria-expanded", "false");
        await trigger(page).click();
        await expect(trigger(page)).toHaveAttribute("aria-expanded", "true");
        const id = await dialog(page).getAttribute("id");
        expect(id).not.toBeNull();
        await expect(trigger(page)).toHaveAttribute(
            "aria-controls",
            id as string,
        );
    });

    test("opens a named, described, modal dialog with focus on the first field", async ({
        page,
    }) => {
        baselineDeviation(
            "Base UI's Dialog popup sets no aria-modal (spec/dialog.md, Baseline deviations)",
        );
        await trigger(page).click();
        await expect(dialog(page)).toBeVisible();
        await expect(dialog(page)).toHaveAttribute("aria-modal", "true");
        await expect(dialog(page)).toHaveAccessibleDescription(
            "Change your display name.",
        );
        await expect(page.getByLabel("Name")).toBeFocused();
    });

    test("traps Tab and Shift+Tab inside the dialog", async ({ page }) => {
        await trigger(page).click();
        await expect(page.getByLabel("Name")).toBeFocused();
        await page.keyboard.press("Tab");
        await expect(page.getByRole("button", { name: "Save" })).toBeFocused();
        await page.keyboard.press("Tab");
        await expect(page.getByRole("button", { name: "Close" })).toBeFocused();
        await page.keyboard.press("Tab");
        await expect(page.getByLabel("Name")).toBeFocused();
        await page.keyboard.press("Shift+Tab");
        await expect(page.getByRole("button", { name: "Close" })).toBeFocused();
    });

    test("makes the rest of the page inert and locks its scroll", async ({
        page,
    }) => {
        await trigger(page).click();
        await expect(dialog(page)).toBeVisible();
        const outside = page.getByRole("button", {
            name: "Outside button",
            includeHidden: true,
        });
        expect(await isInertOrHidden(outside)).toBe(true);
        await page.mouse.move(10, 10);
        await page.mouse.wheel(0, 600);
        await page.waitForTimeout(200);
        expect(await page.evaluate(() => window.scrollY)).toBe(0);
    });

    test("Escape closes and returns focus to the trigger", async ({ page }) => {
        await trigger(page).click();
        await expect(dialog(page)).toBeVisible();
        await page.keyboard.press("Escape");
        await expect(dialog(page)).toBeHidden();
        await expectOutput(page, "reason", "escape-key");
        await expect(trigger(page)).toBeFocused();
    });

    test("an outside press closes", async ({ page }) => {
        await trigger(page).click();
        await expect(dialog(page)).toBeVisible();
        await page.mouse.click(5, 5);
        await expect(dialog(page)).toBeHidden();
        await expectOutput(page, "reason", "outside-press");
    });

    test("Close closes and returns focus to the trigger", async ({ page }) => {
        await trigger(page).click();
        await page.getByRole("button", { name: "Close" }).click();
        await expect(dialog(page)).toBeHidden();
        await expectOutput(page, "reason", "close-press");
        await expect(trigger(page)).toBeFocused();
    });

    test("has no axe violation while open", async ({ page }) => {
        await trigger(page).click();
        await expect(dialog(page)).toBeVisible();
        await expectNoAxeViolations(page);
    });
});

test("dialog / initial-focus: focuses the element given as initial focus", async ({
    page,
}) => {
    await openScenario(page, "/dialog/initial-focus");
    await page.getByRole("button", { name: "Delete file" }).click();
    await expect(
        page.getByRole("dialog", { name: "Delete file?" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Cancel" })).toBeFocused();
});

test.describe("dialog / nested-popover", () => {
    test.beforeEach(async ({ page }) => {
        await openScenario(page, "/dialog/nested-popover");
        await page.getByRole("button", { name: "Open dialog" }).click();
        await page.getByRole("button", { name: "More info" }).click();
        await expect(
            page.getByRole("dialog", { name: "About names" }),
        ).toBeVisible();
    });

    test("focus moves into the popover", async ({ page }) => {
        const popover = page.getByRole("dialog", { name: "About names" });
        await expect
            .poll(() =>
                popover.evaluate((element) =>
                    element.contains(element.ownerDocument.activeElement),
                ),
            )
            .toBe(true);
    });

    test("Escape closes the popover first, then the dialog", async ({
        page,
    }) => {
        await page.keyboard.press("Escape");
        await expect(
            page.getByRole("dialog", { name: "About names" }),
        ).toBeHidden();
        await expect(
            page.getByRole("dialog", { name: "Edit profile" }),
        ).toBeVisible();
        await expect(
            page.getByRole("button", { name: "More info" }),
        ).toBeFocused();
        await page.keyboard.press("Escape");
        await expect(
            page.getByRole("dialog", { name: "Edit profile" }),
        ).toBeHidden();
    });

    test("a press inside the dialog closes only the popover", async ({
        page,
    }) => {
        await page.getByRole("heading", { name: "Edit profile" }).click();
        await expect(
            page.getByRole("dialog", { name: "About names" }),
        ).toBeHidden();
        await expect(
            page.getByRole("dialog", { name: "Edit profile" }),
        ).toBeVisible();
    });
});

test("dialog / controlled: an external button opens it, Close reports and returns focus", async ({
    page,
}) => {
    await openScenario(page, "/dialog/controlled");
    const opener = page.getByRole("button", {
        name: "Open dialog",
        includeHidden: true,
    });
    await opener.click();
    await expect(
        page.getByRole("dialog", { name: "Controlled" }),
    ).toBeVisible();
    await expectOutput(page, "open", "true");
    await page.getByRole("button", { name: "Close" }).click();
    await expect(page.getByRole("dialog", { name: "Controlled" })).toBeHidden();
    await expectOutput(page, "open", "false");
    await expectOutput(page, "reason", "close-press");
    await expect(opener).toBeFocused();
});

test("dialog / rejected-close: a consumer that keeps open: true keeps the dialog open", async ({
    page,
}) => {
    await openScenario(page, "/dialog/rejected-close");
    await page
        .getByRole("button", { name: "Open dialog", includeHidden: true })
        .click();
    const dialog = page.getByRole("dialog", { name: "Locked" });
    await expect(dialog).toBeVisible();
    await expect(page.getByRole("button", { name: "Close" })).toBeFocused();

    await page.keyboard.press("Escape");
    await expectOutput(page, "reason", "escape-key");
    await expectOutput(page, "open", "true");
    await expect(dialog).toBeVisible();
    await expect(page.getByRole("button", { name: "Close" })).toBeFocused();

    await page.mouse.click(5, 5);
    await expectOutput(page, "reason", "outside-press");
    await expect(dialog).toBeVisible();

    await page.getByRole("button", { name: "Close" }).click();
    await expectOutput(page, "reason", "close-press");
    await expectOutput(page, "open", "true");
    await expect(dialog).toBeVisible();

    // still a working modal: Escape is still handled, and the outside stays inert
    await page.keyboard.press("Escape");
    await expect(dialog).toBeVisible();
    expect(
        await isInertOrHidden(
            page.getByRole("button", {
                name: "Open dialog",
                includeHidden: true,
            }),
        ),
    ).toBe(true);
});
