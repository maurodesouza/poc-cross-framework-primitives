import { expect, test } from "@playwright/test";
import { openScenario } from "../../src/scenario.ts";
import { expectScreen, visualOnlyInCi } from "../../src/visual.ts";

test.beforeEach(visualOnlyInCi);

test("menu / basic: open on the first item", async ({ page }) => {
    await openScenario(page, "/menu/basic");
    await page.getByRole("button", { name: "Actions" }).focus();
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("menuitem", { name: "Edit" })).toBeFocused();
    await expectScreen(page, "menu-basic-open");
});

test("menu / submenu: both levels open", async ({ page }) => {
    await openScenario(page, "/menu/submenu");
    await page.getByRole("button", { name: "File" }).focus();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("menuitem", { name: "Email" })).toBeFocused();
    await expectScreen(page, "menu-submenu-open");
});

test("menu / groups: open", async ({ page }) => {
    await openScenario(page, "/menu/groups");
    await page.getByRole("button", { name: "View" }).focus();
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("menuitem", { name: "Name" })).toBeFocused();
    await expectScreen(page, "menu-groups-open");
});
