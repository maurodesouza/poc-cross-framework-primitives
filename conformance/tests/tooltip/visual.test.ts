import { expect, test } from "@playwright/test";
import { openScenario } from "../../src/scenario.ts";
import { expectScreen, visualOnlyInCi } from "../../src/visual.ts";

test.beforeEach(visualOnlyInCi);

test("tooltip / basic: open on focus", async ({ page }) => {
    await openScenario(page, "/tooltip/basic");
    await page.getByRole("button", { name: "Before" }).focus();
    await page.keyboard.press("Tab");
    await expect(
        page.getByRole("tooltip", { name: "Save the document" }),
    ).toBeVisible();
    await expectScreen(page, "tooltip-basic-open");
});
