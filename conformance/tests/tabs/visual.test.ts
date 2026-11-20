import { test } from "@playwright/test";
import { openScenario } from "../../src/scenario.ts";
import { expectScreen, visualOnlyInCi } from "../../src/visual.ts";

test.beforeEach(visualOnlyInCi);

test("tabs / automatic: the first tab selected", async ({ page }) => {
    await openScenario(page, "/tabs/automatic");
    await expectScreen(page, "tabs-automatic");
});

test("tabs / automatic: another tab selected", async ({ page }) => {
    await openScenario(page, "/tabs/automatic");
    await page.getByRole("tab", { name: "Team" }).click();
    await expectScreen(page, "tabs-automatic-team");
});

test("tabs / vertical", async ({ page }) => {
    await openScenario(page, "/tabs/vertical");
    await expectScreen(page, "tabs-vertical");
});
