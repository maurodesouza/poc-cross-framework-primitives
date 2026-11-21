import { expect, test } from "@playwright/test";
import { openScenario } from "../../src/scenario.ts";
import { expectScreen, visualOnlyInCi } from "../../src/visual.ts";

test.beforeEach(visualOnlyInCi);

test("field / basic", async ({ page }) => {
    await openScenario(page, "/field/basic");
    await expect(page.getByRole("textbox", { name: "Email" })).toBeVisible();
    await expectScreen(page, "field-basic");
});

test("field / basic: invalid", async ({ page }) => {
    await openScenario(page, "/field/basic");
    await page.getByRole("button", { name: "Submit" }).click();
    await expect(page.getByText("Enter your email.")).toBeVisible();
    await page.getByRole("textbox", { name: "Email" }).blur();
    await expectScreen(page, "field-basic-invalid");
});

test("field / validation: errors", async ({ page }) => {
    await openScenario(page, "/field/validation");
    await page.getByRole("textbox", { name: "Username" }).fill("a");
    await page.getByRole("textbox", { name: "Password" }).fill("abc");
    await page.getByRole("textbox", { name: "Password" }).blur();
    await expect(page.getByRole("listitem")).toHaveCount(2);
    await expectScreen(page, "field-validation-errors");
});

test("field / controls: invalid", async ({ page }) => {
    await openScenario(page, "/field/controls");
    await page.getByRole("button", { name: "Submit" }).click();
    await expect(page.getByText("Choose a fruit.")).toBeVisible();
    await page.evaluate(() => (document.activeElement as HTMLElement).blur());
    await expectScreen(page, "field-controls-invalid");
});
