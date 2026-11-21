import { expect, test } from "@playwright/test";
import { openScenario } from "../../src/scenario.ts";
import { expectScreen, visualOnlyInCi } from "../../src/visual.ts";

test.beforeEach(visualOnlyInCi);

test("checkbox / basic", async ({ page }) => {
    await openScenario(page, "/checkbox/basic");
    await expect(
        page.getByRole("checkbox", { name: "Subscribe" }),
    ).toHaveAttribute("aria-checked", "true");
    await expectScreen(page, "checkbox-basic");
});

test("checkbox / group: mixed", async ({ page }) => {
    await openScenario(page, "/checkbox/group");
    await expect(
        page.getByRole("checkbox", { name: "All toppings" }),
    ).toHaveAttribute("aria-checked", "mixed");
    await expectScreen(page, "checkbox-group-mixed");
});
