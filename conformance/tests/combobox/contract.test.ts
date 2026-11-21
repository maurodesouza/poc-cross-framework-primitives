import { expect, test } from "@playwright/test";
import { expectNoFalseStates, part } from "../../src/contract.ts";
import { openScenario } from "../../src/scenario.ts";

// spec/combobox.md: anatomy, state attributes
test("combobox / basic: parts, highlight, selection and empty states", async ({
    page,
}) => {
    await openScenario(page, "/combobox/basic");
    const input = part(page, "combobox", "input");
    await expect(part(page, "combobox", "input-group")).toHaveAttribute(
        "role",
        "group",
    );
    await expect(part(page, "combobox", "clear")).toHaveCount(0);
    await input.click();
    await page.keyboard.type("b");
    await expect(input).toHaveAttribute("data-open", "");
    await expect(part(page, "combobox", "input-group")).toHaveAttribute(
        "data-open",
        "",
    );
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
    await expect(part(page, "combobox", "clear")).toHaveAttribute(
        "tabindex",
        "-1",
    );
    await page.keyboard.press("ArrowDown");
    await expect(
        part(page, "combobox", "item").filter({ hasText: "Banana" }),
    ).toHaveAttribute("data-selected", "");
    await expect(part(page, "combobox", "empty")).toHaveAttribute(
        "aria-live",
        "polite",
    );
    await expect(part(page, "combobox", "empty")).toBeEmpty();
    await expectNoFalseStates(page.locator("[data-combobox-part]"));
    await page.keyboard.press("Escape");
    await input.fill("xyz");
    await expect(part(page, "combobox", "list")).toHaveAttribute(
        "data-empty",
        "",
    );
    await expect(part(page, "combobox", "empty")).toHaveText("No fruit found.");
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

test("combobox / objects: the item indicator of the selected item", async ({
    page,
}) => {
    await openScenario(page, "/combobox/objects");
    await part(page, "combobox", "input").click();
    const indicator = part(page, "combobox", "item-indicator");
    await expect(indicator).toHaveCount(1);
    await expect(indicator).toHaveAttribute("aria-hidden", "true");
    await expect(
        part(page, "combobox", "item").filter({ has: indicator }),
    ).toHaveAttribute("data-selected", "");
});

test("combobox / multiple: chips, their remove buttons and the status", async ({
    page,
}) => {
    await openScenario(page, "/combobox/multiple");
    await expect(part(page, "combobox", "chips")).toHaveAttribute(
        "role",
        "toolbar",
    );
    const chips = part(page, "combobox", "chip");
    await expect(chips).toHaveCount(2);
    await expect(chips.first()).toHaveAttribute("tabindex", "-1");
    await expect(part(page, "combobox", "chip-remove")).toHaveCount(2);
    await expect(part(page, "combobox", "chip-remove").first()).toHaveAttribute(
        "tabindex",
        "-1",
    );
    await expect(part(page, "combobox", "status")).toHaveAttribute(
        "aria-live",
        "polite",
    );
    await part(page, "combobox", "input").click();
    await expect(part(page, "combobox", "list")).toHaveAttribute(
        "aria-multiselectable",
        "true",
    );
    await expect(part(page, "combobox", "item-indicator")).toHaveCount(2);
    await expectNoFalseStates(page.locator("[data-combobox-part]"));
});

test("combobox / groups: groups, labels and separators", async ({ page }) => {
    await openScenario(page, "/combobox/groups");
    await part(page, "combobox", "input").click();
    await expect(part(page, "combobox", "group")).toHaveCount(2);
    await expect(part(page, "combobox", "group-label")).toHaveText([
        "Fruits",
        "Vegetables",
    ]);
    await expect(part(page, "combobox", "separator")).toHaveCount(1);
    await expect(part(page, "combobox", "separator")).toHaveAttribute(
        "role",
        "presentation",
    );
    await expect(part(page, "combobox", "separator")).toHaveAttribute(
        "data-orientation",
        "horizontal",
    );
});

test("combobox / form: the hidden inputs", async ({ page }) => {
    await openScenario(page, "/combobox/form");
    const fruit = page.locator(
        '[data-combobox-part="hidden-input"][name="fruit"]',
    );
    await expect(fruit).toHaveCount(1);
    await expect(fruit).toHaveAttribute("aria-hidden", "true");
    await expect(fruit).toHaveAttribute("tabindex", "-1");
    await expect(fruit).toHaveAttribute("required", "");
    const toppings = page.locator(
        '[data-combobox-part="hidden-input"][name="toppings"]',
    );
    await expect(toppings).toHaveCount(1);
    await expect(toppings).toHaveAttribute("type", "hidden");
    await expect(toppings).toHaveValue("nuts");
});

test("combobox / field: the field's states on the input", async ({ page }) => {
    await openScenario(page, "/combobox/field");
    await page.getByRole("button", { name: "Submit" }).click();
    await expect(part(page, "combobox", "input")).toHaveAttribute(
        "data-invalid",
        "",
    );
});
