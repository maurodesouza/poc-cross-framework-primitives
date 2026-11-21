import { expect, type Page, test } from "@playwright/test";
import { expectNoAxeViolations } from "../../src/axe.ts";
import { baselineDeviation } from "../../src/deviation.ts";
import { expectOutput } from "../../src/output.ts";
import { openScenario } from "../../src/scenario.ts";

// spec/combobox.md
const input = (page: Page) => page.getByRole("combobox", { name: "Fruit" });
const listbox = (page: Page) => page.getByRole("listbox");
const option = (page: Page, name: string) => page.getByRole("option", { name });

async function expectActive(page: Page, name: string | null) {
    if (name === null) {
        await expect(input(page)).not.toHaveAttribute(
            "aria-activedescendant",
            /.+/,
        );
        return;
    }
    const id = await option(page, name).getAttribute("id");
    expect(id).not.toBeNull();
    await expect(input(page)).toHaveAttribute(
        "aria-activedescendant",
        id as string,
    );
}

test.describe("combobox / basic", () => {
    test.beforeEach(async ({ page }) => {
        await openScenario(page, "/combobox/basic");
    });

    test("is a named combobox with list autocomplete", async ({ page }) => {
        await expect(input(page)).toHaveAttribute("aria-expanded", "false");
        await expect(input(page)).toHaveAttribute("aria-autocomplete", "list");
    });

    test("typing filters and opens without highlighting; focus stays in the input", async ({
        page,
    }) => {
        await input(page).click();
        await page.keyboard.type("b");
        await expect(listbox(page)).toBeVisible();
        await expect(page.getByRole("option")).toHaveText([
            "Banana",
            "Blueberry",
        ]);
        await expect(input(page)).toHaveAttribute("aria-expanded", "true");
        await expectActive(page, null);
        await expect(input(page)).toBeFocused();
    });

    test("arrows move the virtual focus and wrap; Enter chooses", async ({
        page,
    }) => {
        await input(page).click();
        await page.keyboard.type("b");
        await expect(page.getByRole("option")).toHaveText([
            "Banana",
            "Blueberry",
        ]);
        await page.keyboard.press("ArrowDown");
        await expectActive(page, "Banana");
        await page.keyboard.press("ArrowDown");
        await expectActive(page, "Blueberry");
        await page.keyboard.press("ArrowDown");
        await expectActive(page, null);
        await page.keyboard.press("ArrowDown");
        await expectActive(page, "Banana");
        await expect(input(page)).toBeFocused();
        await page.keyboard.press("Enter");
        await expectOutput(page, "value", "banana");
        await expect(input(page)).toHaveValue("Banana");
        await expect(listbox(page)).toBeHidden();
    });

    test("ArrowDown reopens on the selected item; Escape when closed clears the text and the value", async ({
        page,
    }) => {
        await input(page).click();
        await page.keyboard.type("ban");
        await expect(page.getByRole("option")).toHaveText(["Banana"]);
        await page.keyboard.press("ArrowDown");
        await expectActive(page, "Banana");
        await page.keyboard.press("Enter");
        await expectOutput(page, "value", "banana");
        await expect(listbox(page)).toBeHidden();
        await page.keyboard.press("ArrowDown");
        await expect(listbox(page)).toBeVisible();
        await expectActive(page, "Banana");
        await expect(option(page, "Banana")).toHaveAttribute(
            "aria-selected",
            "true",
        );
        await page.keyboard.press("Escape");
        await expect(listbox(page)).toBeHidden();
        await page.keyboard.press("Escape");
        await expect(input(page)).toHaveValue("");
        await expectOutput(page, "value", "none");
    });

    test("a disabled item can be highlighted but not chosen", async ({
        page,
    }) => {
        await input(page).click();
        await page.keyboard.type("an");
        await expect(page.getByRole("option")).toHaveText([
            "Banana",
            "Mango",
            "Orange",
        ]);
        await expect(option(page, "Orange")).toHaveAttribute(
            "aria-disabled",
            "true",
        );
        await page.keyboard.press("ArrowDown");
        await expectActive(page, "Banana");
        await page.keyboard.press("ArrowDown");
        await expectActive(page, "Mango");
        await page.keyboard.press("ArrowDown");
        await expectActive(page, "Orange");
        await page.keyboard.press("Enter");
        await expectOutput(page, "value", "none");
        await expect(listbox(page)).toBeVisible();
        await page.keyboard.press("ArrowDown");
        await expectActive(page, null);
    });

    test("an empty result shows the empty content and no option", async ({
        page,
    }) => {
        await input(page).click();
        await page.keyboard.type("xyz");
        await expect(page.getByText("No fruit found.")).toBeVisible();
        await expect(page.getByRole("option")).toHaveCount(0);
    });

    test("Escape closes keeping the text, then clears it", async ({ page }) => {
        baselineDeviation(
            "Base UI's Combobox resets the typed text to the selected item's label when Escape closes the list (spec/combobox.md, Baseline deviations)",
        );
        await input(page).click();
        await page.keyboard.type("che");
        await expect(listbox(page)).toBeVisible();
        await page.keyboard.press("Escape");
        await expect(listbox(page)).toBeHidden();
        await expect(input(page)).toHaveValue("che");
        await page.keyboard.press("Escape");
        await expect(input(page)).toHaveValue("");
    });

    test("the trigger opens the list and keeps focus in the input; a click chooses", async ({
        page,
    }) => {
        await input(page).click();
        await page.getByRole("button", { name: "Show fruits" }).click();
        await expect(listbox(page)).toBeVisible();
        await expect(input(page)).toBeFocused();
        await option(page, "Cherry").click();
        await expectOutput(page, "value", "cherry");
        await expect(input(page)).toHaveValue("Cherry");
    });

    test("an outside press closes", async ({ page }) => {
        await input(page).click();
        await page.keyboard.type("a");
        await expect(listbox(page)).toBeVisible();
        await page.getByTestId("output").click();
        await expect(listbox(page)).toBeHidden();
        await expectOutput(page, "reason", "outside-press");
    });

    test("has no axe violation while open", async ({ page }) => {
        baselineDeviation(
            "Base UI hides everything outside the open list from assistive technologies, the input's <label> included (spec/combobox.md, Baseline deviations)",
        );
        await input(page).click();
        await page.keyboard.type("a");
        await expect(listbox(page)).toBeVisible();
        await expectNoAxeViolations(page);
    });
});

test("combobox / controlled: starts on Mango, Reset clears it", async ({
    page,
}) => {
    await openScenario(page, "/combobox/controlled");
    await expect(input(page)).toHaveValue("Mango");
    await input(page).click();
    await page.keyboard.press("ArrowDown");
    await expectActive(page, "Mango");
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Reset" }).click();
    await expect(input(page)).toHaveValue("");
    await input(page).click();
    await page.keyboard.press("ArrowDown");
    await expectActive(page, "Apple");
});

test("combobox / rejected-input: an input value the consumer refuses is not shown", async ({
    page,
}) => {
    await openScenario(page, "/combobox/rejected-input");
    await input(page).click();
    await page.keyboard.type("b");
    await expect(input(page)).toHaveValue("b");
    await expect(page.getByRole("option")).toHaveText(["Banana", "Blueberry"]);
    await page.keyboard.type("1");
    await expect(input(page)).toHaveValue("b");
    await expectOutput(page, "input", "b");
    await expect(page.getByRole("option")).toHaveText(["Banana", "Blueberry"]);
    await page.keyboard.type("l");
    await expect(input(page)).toHaveValue("bl");
    await expectOutput(page, "input", "bl");
    await expect(page.getByRole("option")).toHaveText(["Blueberry"]);
});
