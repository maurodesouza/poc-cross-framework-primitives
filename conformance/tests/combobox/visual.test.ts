import { expect, test } from "@playwright/test";
import { openScenario } from "../../src/scenario.ts";
import { expectScreen, visualOnlyInCi } from "../../src/visual.ts";

test.beforeEach(visualOnlyInCi);

test("combobox / basic: filtered, one item highlighted", async ({ page }) => {
    await openScenario(page, "/combobox/basic");
    await page.getByRole("combobox", { name: "Fruit" }).click();
    await page.keyboard.type("b");
    await expect(page.getByRole("option")).toHaveCount(2);
    await page.keyboard.press("ArrowDown");
    await expectScreen(page, "combobox-basic-open");
});

test("combobox / basic: nothing found", async ({ page }) => {
    await openScenario(page, "/combobox/basic");
    await page.getByRole("combobox", { name: "Fruit" }).click();
    await page.keyboard.type("xyz");
    await expect(page.getByText("No fruit found.")).toBeVisible();
    await expectScreen(page, "combobox-basic-empty");
});
