import { expect, test } from "@playwright/test";
import { expectNoFalseStates, part } from "../../src/contract.ts";
import { openScenario } from "../../src/scenario.ts";

// spec/menu.md: anatomy, state attributes
test("menu / basic: parts, highlight and disabled states", async ({ page }) => {
    await openScenario(page, "/menu/basic");
    await part(page, "menu", "trigger").focus();
    await page.keyboard.press("ArrowDown");
    await expect(part(page, "menu", "trigger")).toHaveAttribute(
        "data-open",
        "",
    );
    await expect(part(page, "menu", "popup")).toHaveAttribute("data-open", "");
    await expect(part(page, "menu", "positioner")).toHaveAttribute(
        "data-side",
        "bottom",
    );
    const items = part(page, "menu", "item");
    await expect(items).toHaveCount(4);
    await expect(items.nth(0)).toHaveAttribute("data-highlighted", "");
    await expect(items.nth(1)).not.toHaveAttribute("data-highlighted");
    await expect(items.nth(2)).toHaveAttribute("data-disabled", "");
    await expect(part(page, "menu", "separator")).toHaveCount(1);
    await expectNoFalseStates(page.locator("[data-menu-part]"));
});

test("menu / submenu: the submenu trigger and the nested levels", async ({
    page,
}) => {
    await openScenario(page, "/menu/submenu");
    await part(page, "menu", "trigger").focus();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    const submenuTrigger = part(page, "menu", "submenu-trigger");
    await expect(submenuTrigger).toHaveAttribute("data-highlighted", "");
    await page.keyboard.press("ArrowRight");
    await expect(submenuTrigger).toHaveAttribute("data-open", "");
    await expect(
        page.locator('[data-menu-part="popup"][data-nested]'),
    ).toHaveCount(1);
    await expect(
        page.locator('[data-menu-part="positioner"][data-nested]'),
    ).toHaveCount(1);
});

test("menu / groups: group and group label parts", async ({ page }) => {
    await openScenario(page, "/menu/groups");
    await part(page, "menu", "trigger").click();
    await expect(part(page, "menu", "group")).toHaveCount(2);
    await expect(part(page, "menu", "group-label")).toHaveCount(2);
});
