import { expect, test } from "@playwright/test";
import { expectNoFalseStates, part } from "../../src/contract.ts";
import { openScenario } from "../../src/scenario.ts";

// spec/combobox.md: anatomy, state attributes
test("combobox / basic: parts, highlight, selection and empty states", async ({
    page,
}) => {
    await openScenario(page, "/combobox/basic");
    const input = part(page, "combobox", "input");
    await input.click();
    await page.keyboard.type("b");
    await expect(input).toHaveAttribute("data-open", "");
    await expect(part(page, "combobox", "trigger")).toHaveAttribute(
        "data-open",
        "",
    );
    await expect(part(page, "combobox", "trigger")).toHaveAttribute(
        "tabindex",
        "-1",
    );
    const items = part(page, "combobox", "item");
    await expect(items).toHaveCount(2);
    await page.keyboard.press("ArrowDown");
    await expect(items.nth(0)).toHaveAttribute("data-highlighted", "");
    await expect(items.nth(1)).not.toHaveAttribute("data-highlighted");
    await page.keyboard.press("Enter");
    await page.keyboard.press("ArrowDown");
    await expect(part(page, "combobox", "item").first()).toHaveAttribute(
        "data-selected",
        "",
    );
    await expectNoFalseStates(page.locator("[data-combobox-part]"));
    await page.keyboard.press("Escape");
    await input.fill("xyz");
    await expect(part(page, "combobox", "list")).toHaveAttribute(
        "data-empty",
        "",
    );
    await expect(part(page, "combobox", "empty")).toBeVisible();
});

test("combobox / basic: a disabled item", async ({ page }) => {
    await openScenario(page, "/combobox/basic");
    await part(page, "combobox", "input").click();
    await page.keyboard.type("orange");
    await expect(part(page, "combobox", "item")).toHaveAttribute(
        "data-disabled",
        "",
    );
});
