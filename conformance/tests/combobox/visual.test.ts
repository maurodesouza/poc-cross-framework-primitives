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

test("combobox / multiple: chips, the open list with its indicators", async ({
    page,
}) => {
    await openScenario(page, "/combobox/multiple");
    await page.getByRole("combobox", { name: "Fruits" }).click();
    await expect(page.getByRole("option")).toHaveCount(7);
    await page.keyboard.press("ArrowDown");
    await expectScreen(page, "combobox-multiple-open");
});

test("combobox / groups: the grouped list", async ({ page }) => {
    await openScenario(page, "/combobox/groups");
    await page.getByRole("combobox", { name: "Produce" }).click();
    await expect(page.getByRole("option")).toHaveCount(6);
    await expectScreen(page, "combobox-groups-open");
});

test("combobox / field: the invalid state", async ({ page }) => {
    await openScenario(page, "/combobox/field");
    await page.getByRole("button", { name: "Submit" }).click();
    await expect(page.getByText("Choose a fruit.")).toBeVisible();
    await expectScreen(page, "combobox-field-invalid");
});
