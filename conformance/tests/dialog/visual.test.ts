import { expect, test } from "@playwright/test";
import { openScenario } from "../../src/scenario.ts";
import { expectScreen, visualOnlyInCi } from "../../src/visual.ts";

// One golden set for every implementation (AGENTS.md rule 4)
test.beforeEach(visualOnlyInCi);

test("dialog / basic: closed and open", async ({ page }) => {
    await openScenario(page, "/dialog/basic");
    await expectScreen(page, "dialog-basic-closed");
    await page.getByRole("button", { name: "Open dialog" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expectScreen(page, "dialog-basic-open");
});
