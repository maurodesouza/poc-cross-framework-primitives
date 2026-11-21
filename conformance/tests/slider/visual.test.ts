import { expect, test } from "@playwright/test";
import { openScenario } from "../../src/scenario.ts";
import { expectScreen, visualOnlyInCi } from "../../src/visual.ts";

test.beforeEach(visualOnlyInCi);

test("slider / basic", async ({ page }) => {
    await openScenario(page, "/slider/basic");
    await expect(page.getByRole("slider", { name: "Volume" })).toBeVisible();
    await expectScreen(page, "slider-basic");
});

test("slider / range", async ({ page }) => {
    await openScenario(page, "/slider/range");
    await expect(page.getByRole("slider")).toHaveCount(2);
    await expectScreen(page, "slider-range");
});

test("slider / vertical", async ({ page }) => {
    await openScenario(page, "/slider/vertical");
    await expect(
        page.getByRole("slider", { name: "Brightness" }),
    ).toBeVisible();
    await expectScreen(page, "slider-vertical");
});
