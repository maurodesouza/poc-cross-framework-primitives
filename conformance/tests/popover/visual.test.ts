import { expect, test } from "@playwright/test";
import { openScenario } from "../../src/scenario.ts";
import { expectScreen, visualOnlyInCi } from "../../src/visual.ts";

test.beforeEach(visualOnlyInCi);

test("popover / basic: open", async ({ page }) => {
    await openScenario(page, "/popover/basic");
    await page.getByRole("button", { name: "Open popover" }).click();
    await expect(
        page.getByRole("dialog", { name: "Notifications" }),
    ).toBeVisible();
    await expectScreen(page, "popover-basic-open");
});

test("popover / arrow: open", async ({ page }) => {
    await openScenario(page, "/popover/arrow");
    await page.getByRole("button", { name: "With arrow" }).click();
    await expect(page.getByRole("dialog", { name: "Arrow" })).toBeVisible();
    await expectScreen(page, "popover-arrow-open");
});
