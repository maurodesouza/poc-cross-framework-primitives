import { expect, test } from "@playwright/test";
import { openScenario } from "../../src/scenario.ts";
import { expectScreen, visualOnlyInCi } from "../../src/visual.ts";

test.beforeEach(visualOnlyInCi);

test("select / basic: closed", async ({ page }) => {
    await openScenario(page, "/select/basic");
    await expect(page.getByRole("combobox", { name: "Fruit" })).toHaveText(
        "Choose a fruit",
    );
    await expectScreen(page, "select-basic-closed");
});

test("select / basic: open on the selection", async ({ page }) => {
    await openScenario(page, "/select/basic");
    const trigger = page.getByRole("combobox", { name: "Fruit" });
    await trigger.focus();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveText("Banana");
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("listbox")).toBeVisible();
    await expectScreen(page, "select-basic-open");
});
