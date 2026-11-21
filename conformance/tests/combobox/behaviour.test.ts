import { expect, type Page, test } from "@playwright/test";
import { expectNoAxeViolations } from "../../src/axe.ts";
import { baselineDeviation } from "../../src/deviation.ts";
import { expectSubmitted } from "../../src/form.ts";
import { expectOutput } from "../../src/output.ts";
import { openScenario } from "../../src/scenario.ts";

// spec/combobox.md
const combobox = (page: Page, name = "Fruit") =>
    page.getByRole("combobox", { name, exact: true });
const listbox = (page: Page) => page.getByRole("listbox");
const options = (page: Page) => page.getByRole("option");
const option = (page: Page, name: string) =>
    page.getByRole("option", { name, exact: true });

async function expectActive(
    page: Page,
    name: string | null,
    field = "Fruit",
): Promise<void> {
    if (name === null) {
        await expect(combobox(page, field)).not.toHaveAttribute(
            "aria-activedescendant",
            /.+/,
        );
        return;
    }
    const id = await option(page, name).getAttribute("id");
    expect(id).not.toBeNull();
    await expect(combobox(page, field)).toHaveAttribute(
        "aria-activedescendant",
        id as string,
    );
}

/** Clicks the input, types `text`, highlights the first match (`first`) and chooses it. */
async function choose(
    page: Page,
    text: string,
    first: string,
    field = "Fruit",
): Promise<void> {
    await combobox(page, field).click();
    await page.keyboard.type(text);
    await expect(options(page).first()).toHaveText(first);
    await page.keyboard.press("ArrowDown");
    await expectActive(page, first, field);
    await page.keyboard.press("Enter");
}

/** Replaces the input's text with `text`, as a user selecting it all and typing. */
async function retype(page: Page, text: string, field = "Fruit") {
    await combobox(page, field).press("ControlOrMeta+a");
    await page.keyboard.type(text);
}

test.describe("combobox / basic", () => {
    test.beforeEach(async ({ page }) => {
        await openScenario(page, "/combobox/basic");
    });

    test("is a named combobox with list autocomplete", async ({ page }) => {
        await expect(combobox(page)).toHaveAttribute("aria-expanded", "false");
        await expect(combobox(page)).toHaveAttribute(
            "aria-autocomplete",
            "list",
        );
    });

    test("a click on the input opens the whole list, nothing highlighted", async ({
        page,
    }) => {
        await combobox(page).click();
        await expect(listbox(page)).toBeVisible();
        await expect(options(page)).toHaveCount(7);
        await expectActive(page, null);
        await expectOutput(page, "reason", "input-press");
    });

    test("typing filters and opens without highlighting; focus stays in the input", async ({
        page,
    }) => {
        await combobox(page).click();
        await page.keyboard.type("b");
        await expect(listbox(page)).toBeVisible();
        await expect(options(page)).toHaveText(["Banana", "Blueberry"]);
        await expect(combobox(page)).toHaveAttribute("aria-expanded", "true");
        await expectActive(page, null);
        await expect(combobox(page)).toBeFocused();
    });

    test("arrows move the virtual focus and wrap; Enter chooses", async ({
        page,
    }) => {
        await combobox(page).click();
        await page.keyboard.type("b");
        await expect(options(page)).toHaveText(["Banana", "Blueberry"]);
        await page.keyboard.press("ArrowDown");
        await expectActive(page, "Banana");
        await page.keyboard.press("ArrowDown");
        await expectActive(page, "Blueberry");
        await page.keyboard.press("ArrowDown");
        await expectActive(page, null);
        await page.keyboard.press("ArrowDown");
        await expectActive(page, "Banana");
        await expect(combobox(page)).toBeFocused();
        await page.keyboard.press("Enter");
        await expectOutput(page, "value", "banana");
        await expect(combobox(page)).toHaveValue("Banana");
        await expect(listbox(page)).toBeHidden();
    });

    test("ArrowDown reopens the whole list on the selected item; Escape when closed clears the text and the value", async ({
        page,
    }) => {
        await choose(page, "ban", "Banana");
        await expectOutput(page, "value", "banana");
        await expect(listbox(page)).toBeHidden();
        await page.keyboard.press("ArrowDown");
        await expect(listbox(page)).toBeVisible();
        await expect(options(page)).toHaveCount(7);
        await expectActive(page, "Banana");
        await expect(option(page, "Banana")).toHaveAttribute(
            "aria-selected",
            "true",
        );
        await page.keyboard.press("Escape");
        await expect(listbox(page)).toBeHidden();
        await expect(combobox(page)).toHaveValue("Banana");
        await page.keyboard.press("Escape");
        await expect(combobox(page)).toHaveValue("");
        await expectOutput(page, "value", "none");
    });

    test("a disabled item can be highlighted but not chosen", async ({
        page,
    }) => {
        await combobox(page).click();
        await page.keyboard.type("an");
        await expect(options(page)).toHaveText(["Banana", "Mango", "Orange"]);
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
        await combobox(page).click();
        await page.keyboard.type("xyz");
        await expect(page.getByText("No fruit found.")).toBeVisible();
        await expect(options(page)).toHaveCount(0);
    });

    test("Escape closes and resets the text to the selected item", async ({
        page,
    }) => {
        await combobox(page).click();
        await page.keyboard.type("che");
        await expect(listbox(page)).toBeVisible();
        await page.keyboard.press("Escape");
        await expect(listbox(page)).toBeHidden();
        await expect(combobox(page)).toHaveValue("");
        await choose(page, "che", "Cherry");
        await expectOutput(page, "value", "cherry");
        await page.keyboard.type("x");
        await expect(combobox(page)).toHaveValue("Cherryx");
        await expect(combobox(page)).toHaveAttribute("aria-expanded", "true");
        await page.keyboard.press("Escape");
        await expect(listbox(page)).toBeHidden();
        await expect(combobox(page)).toHaveValue("Cherry");
        await expectOutput(page, "value", "cherry");
    });

    test("the trigger opens the list and keeps focus in the input; a click chooses", async ({
        page,
    }) => {
        await page.getByRole("button", { name: "Show fruits" }).click();
        await expect(listbox(page)).toBeVisible();
        await expect(combobox(page)).toBeFocused();
        await option(page, "Cherry").click();
        await expectOutput(page, "value", "cherry");
        await expect(combobox(page)).toHaveValue("Cherry");
    });

    test("Clear empties the text and the value, keeping focus in the input", async ({
        page,
    }) => {
        const clear = page.getByRole("button", { name: "Clear fruit" });
        await expect(clear).toHaveCount(0);
        await choose(page, "che", "Cherry");
        await expectOutput(page, "value", "cherry");
        await clear.click();
        await expect(combobox(page)).toHaveValue("");
        await expectOutput(page, "value", "none");
        await expect(combobox(page)).toBeFocused();
        await expect(clear).toHaveCount(0);
    });

    test("an outside press closes and resets the text", async ({ page }) => {
        await combobox(page).click();
        await page.keyboard.type("a");
        await expect(listbox(page)).toBeVisible();
        // the corner of the page: outside the input, the list and the output
        await page.mouse.click(2, 2);
        await expect(listbox(page)).toBeHidden();
        await expectOutput(page, "reason", "outside-press");
        await expect(combobox(page)).toHaveValue("");
    });

    test("has no axe violation while open", async ({ page }) => {
        baselineDeviation(
            "Base UI hides everything outside the open list from assistive technologies, the input's <label> included (spec/combobox.md, Baseline deviations)",
        );
        await combobox(page).click();
        await page.keyboard.type("a");
        await expect(listbox(page)).toBeVisible();
        await expectNoAxeViolations(page);
    });
});

test("combobox / controlled: starts on Mango, Reset clears it", async ({
    page,
}) => {
    await openScenario(page, "/combobox/controlled");
    await expect(combobox(page)).toHaveValue("Mango");
    await combobox(page).click();
    await expectActive(page, "Mango");
    await page.keyboard.press("Escape");
    await expect(listbox(page)).toBeHidden();
    await page.getByRole("button", { name: "Reset" }).click();
    await expect(combobox(page)).toHaveValue("");
    await combobox(page).click();
    await page.keyboard.press("ArrowDown");
    await expectActive(page, "Apple");
});

test("combobox / rejected-input: an input value the consumer refuses is not shown", async ({
    page,
}) => {
    await openScenario(page, "/combobox/rejected-input");
    await combobox(page).click();
    await page.keyboard.type("b");
    await expect(combobox(page)).toHaveValue("b");
    await expect(options(page)).toHaveText(["Banana", "Blueberry"]);
    await page.keyboard.type("1");
    await expect(combobox(page)).toHaveValue("b");
    await expectOutput(page, "input", "b");
    await expect(options(page)).toHaveText(["Banana", "Blueberry"]);
    await page.keyboard.type("l");
    await expect(combobox(page)).toHaveValue("bl");
    await expectOutput(page, "input", "bl");
    await expect(options(page)).toHaveText(["Blueberry"]);
});

test.describe("combobox / filtered", () => {
    test.beforeEach(async ({ page }) => {
        await openScenario(page, "/combobox/filtered");
    });

    test("the default filter ignores case and accents, within the limit", async ({
        page,
    }) => {
        await combobox(page, "City").click();
        await expect(options(page)).toHaveText([
            "Bogotá",
            "Brasília",
            "Kraków",
            "Málaga",
        ]);
        await page.keyboard.type("sao");
        await expect(options(page)).toHaveText(["São Paulo"]);
        await retype(page, "ZUR", "City");
        await expect(options(page)).toHaveText(["Zürich"]);
        await retype(page, "a", "City");
        await expect(options(page)).toHaveText([
            "Bogotá",
            "Brasília",
            "Kraków",
            "Málaga",
        ]);
        await page.keyboard.press("ArrowDown");
        await expectActive(page, "Bogotá", "City");
        await page.keyboard.press("Enter");
        await expectOutput(page, "city", "Bogotá");
    });

    test("a list the consumer filters keeps working", async ({ page }) => {
        await combobox(page).click();
        await page.keyboard.type("b");
        await expect(options(page)).toHaveText(["Banana", "Blueberry"]);
        await page.keyboard.type("l");
        await expect(options(page)).toHaveText(["Blueberry"]);
        await page.keyboard.press("ArrowDown");
        await expectActive(page, "Blueberry");
        await page.keyboard.press("Enter");
        await expectOutput(page, "fruit", "Blueberry");
        await retype(page, "an");
        await expect(page.getByText("No fruit found.")).toBeVisible();
        await expect(options(page)).toHaveCount(0);
    });
});

test("combobox / objects: object values, compared and named by the consumer", async ({
    page,
}) => {
    await openScenario(page, "/combobox/objects");
    const country = combobox(page, "Country");
    await expect(country).toHaveValue("Brazil");
    await country.click();
    await expect(options(page)).toHaveCount(5);
    await expectActive(page, "Brazil", "Country");
    await expect(option(page, "Brazil")).toHaveAttribute(
        "aria-selected",
        "true",
    );
    await expect(option(page, "Brazil")).toContainText("✓");
    await page.keyboard.press("Escape");
    await expect(listbox(page)).toBeHidden();
    await retype(page, "de", "Country");
    await expect(options(page)).toHaveText(["Germany", "Sweden"]);
    await page.keyboard.press("ArrowDown");
    await expectActive(page, "Germany", "Country");
    await page.keyboard.press("Enter");
    await expectOutput(page, "value", "DE");
    await expect(country).toHaveValue("Germany");
});

test.describe("combobox / multiple", () => {
    const fruits = (page: Page) => combobox(page, "Fruits");
    const toolbar = (page: Page) => page.getByRole("toolbar");
    // a chip holds its label and its remove button
    const chip = (page: Page, name: string) => toolbar(page).getByText(name);

    test.beforeEach(async ({ page }) => {
        await openScenario(page, "/combobox/multiple");
    });

    test("the values are chips in a toolbar, with a status", async ({
        page,
    }) => {
        await expect(chip(page, "Apple")).toBeVisible();
        await expect(chip(page, "Cherry")).toBeVisible();
        await expect(
            page.getByRole("status").filter({ hasText: "selected" }),
        ).toContainText("2 fruits selected.");
    });

    test("a multiselectable list; choosing toggles a value and keeps the list open", async ({
        page,
    }) => {
        await fruits(page).click();
        await expect(listbox(page)).toHaveAttribute(
            "aria-multiselectable",
            "true",
        );
        await expect(option(page, "Apple")).toHaveAttribute(
            "aria-selected",
            "true",
        );
        await expect(option(page, "Cherry")).toHaveAttribute(
            "aria-selected",
            "true",
        );
        await option(page, "Banana").click();
        await expectOutput(page, "value", "apple,cherry,banana");
        await expect(listbox(page)).toBeVisible();
        await option(page, "Apple").click();
        await expectOutput(page, "value", "cherry,banana");
        await expect(chip(page, "Apple")).toHaveCount(0);
        await expect(fruits(page)).toBeFocused();
    });

    test("choosing while filtering adds the value, clears the text and closes", async ({
        page,
    }) => {
        await fruits(page).click();
        await page.keyboard.type("gr");
        await expect(options(page)).toHaveText(["Grape"]);
        await page.keyboard.press("ArrowDown");
        await expectActive(page, "Grape", "Fruits");
        await page.keyboard.press("Enter");
        await expectOutput(page, "value", "apple,cherry,grape");
        await expect(fruits(page)).toHaveValue("");
        await expect(listbox(page)).toBeHidden();
    });

    test("Backspace in the empty input removes the last value", async ({
        page,
    }) => {
        await fruits(page).focus();
        await page.keyboard.press("Backspace");
        await expectOutput(page, "value", "apple");
        await expect(chip(page, "Cherry")).toHaveCount(0);
    });

    test("the arrows move between the chips; Backspace removes the focused one", async ({
        page,
    }) => {
        await fruits(page).focus();
        await page.keyboard.press("ArrowLeft");
        await expect(chip(page, "Cherry")).toBeFocused();
        await page.keyboard.press("ArrowLeft");
        await expect(chip(page, "Apple")).toBeFocused();
        await page.keyboard.press("ArrowRight");
        await expect(chip(page, "Cherry")).toBeFocused();
        await page.keyboard.press("ArrowRight");
        await expect(fruits(page)).toBeFocused();
        await page.keyboard.press("ArrowLeft");
        await expect(chip(page, "Cherry")).toBeFocused();
        await page.keyboard.press("Backspace");
        await expectOutput(page, "value", "apple");
        await expect(chip(page, "Apple")).toBeFocused();
    });

    test("a chip's remove button removes it and focuses the input", async ({
        page,
    }) => {
        await page.getByRole("button", { name: "Remove Apple" }).click();
        await expectOutput(page, "value", "cherry");
        await expect(fruits(page)).toBeFocused();
    });

    test("Clear removes every value", async ({ page }) => {
        const clear = page.getByRole("button", { name: "Clear fruits" });
        await clear.click();
        await expectOutput(page, "value", "none");
        await expect(toolbar(page)).toHaveCount(0);
        await expect(clear).toHaveCount(0);
    });

    test("has no axe violation while open", async ({ page }) => {
        baselineDeviation(
            "Base UI hides everything outside the open list from assistive technologies, the input's <label> included (spec/combobox.md, Baseline deviations)",
        );
        await fruits(page).click();
        await expect(listbox(page)).toBeVisible();
        await expectNoAxeViolations(page);
    });
});

test.describe("combobox / groups", () => {
    const produce = (page: Page) => combobox(page, "Produce");
    const group = (page: Page, name: string) =>
        page.getByRole("group", { name, exact: true });

    test.beforeEach(async ({ page }) => {
        await openScenario(page, "/combobox/groups");
    });

    test("named groups", async ({ page }) => {
        await produce(page).click();
        await expect(group(page, "Fruits").getByRole("option")).toHaveText([
            "Apple",
            "Banana",
            "Cherry",
        ]);
        await expect(group(page, "Vegetables").getByRole("option")).toHaveText([
            "Carrot",
            "Celery",
            "Potato",
        ]);
    });

    test("filtering keeps the groups; the arrows cross them", async ({
        page,
    }) => {
        await produce(page).click();
        await page.keyboard.type("c");
        await expect(group(page, "Fruits").getByRole("option")).toHaveText([
            "Cherry",
        ]);
        await expect(group(page, "Vegetables").getByRole("option")).toHaveText([
            "Carrot",
            "Celery",
        ]);
        await page.keyboard.press("ArrowDown");
        await expectActive(page, "Cherry", "Produce");
        await page.keyboard.press("ArrowDown");
        await expectActive(page, "Carrot", "Produce");
        await page.keyboard.press("ArrowDown");
        await expectActive(page, "Celery", "Produce");
        await page.keyboard.press("Enter");
        await expectOutput(page, "value", "celery");
        await retype(page, "pot", "Produce");
        await expect(options(page)).toHaveText(["Potato"]);
        await expect(group(page, "Fruits")).toHaveCount(0);
        await expect(group(page, "Vegetables")).toBeVisible();
    });

    test("has no axe violation while open", async ({ page }) => {
        baselineDeviation(
            "Base UI hides everything outside the open list from assistive technologies, the input's <label> included (spec/combobox.md, Baseline deviations)",
        );
        await produce(page).click();
        await expect(listbox(page)).toBeVisible();
        await expectNoAxeViolations(page);
    });
});

test.describe("combobox / form", () => {
    const submit = (page: Page) => page.getByRole("button", { name: "Submit" });

    test.beforeEach(async ({ page }) => {
        await openScenario(page, "/combobox/form");
    });

    test("required blocks the submission and focuses the input", async ({
        page,
    }) => {
        await submit(page).click();
        await expectSubmitted(page, "none");
        await expect(combobox(page)).toBeFocused();
    });

    test("one entry for a single value, one per value with multiple", async ({
        page,
    }) => {
        await choose(page, "ban", "Banana");
        await expect(combobox(page)).toHaveValue("Banana");
        await submit(page).click();
        await expectSubmitted(page, "fruit=banana&toppings=nuts");
        await combobox(page, "Toppings").click();
        await option(page, "Cream").click();
        await page.keyboard.press("Escape");
        await expect(listbox(page)).toBeHidden();
        await submit(page).click();
        await expectSubmitted(
            page,
            "fruit=banana&toppings=nuts&toppings=cream",
        );
    });

    test("a reset returns to the defaults", async ({ page }) => {
        baselineDeviation(
            "Base UI's Combobox keeps its value and text when its form is reset (spec/combobox.md, Baseline deviations)",
        );
        await choose(page, "ban", "Banana");
        await combobox(page, "Toppings").click();
        await option(page, "Cream").click();
        await page.keyboard.press("Escape");
        await expect(listbox(page)).toBeHidden();
        await page.getByRole("button", { name: "Reset" }).click();
        await expect(combobox(page)).toHaveValue("");
        const toolbar = page.getByRole("toolbar");
        await expect(toolbar.getByText("Nuts")).toBeVisible();
        await expect(toolbar.getByText("Cream")).toHaveCount(0);
        await submit(page).click();
        await expectSubmitted(page, "none");
    });

    test("has no axe violation", async ({ page }) => {
        await expectNoAxeViolations(page);
    });
});

test.describe("combobox / field", () => {
    const submit = (page: Page) => page.getByRole("button", { name: "Submit" });

    test.beforeEach(async ({ page }) => {
        await openScenario(page, "/combobox/field");
    });

    test("labelled and described by the field", async ({ page }) => {
        await expect(combobox(page)).toHaveAccessibleDescription("Pick one.");
        await expect(combobox(page)).not.toHaveAttribute("aria-invalid");
        await page.getByText("Fruit", { exact: true }).click();
        await expect(combobox(page)).toBeFocused();
    });

    test("a failed submission shows the error; choosing hides it", async ({
        page,
    }) => {
        await submit(page).click();
        await expectSubmitted(page, "none");
        await expect(combobox(page)).toBeFocused();
        await expect(combobox(page)).toHaveAttribute("aria-invalid", "true");
        await expect(page.getByText("Choose a fruit.")).toBeVisible();
        await expect(combobox(page)).toHaveAccessibleDescription(
            "Pick one. Choose a fruit.",
        );
        await expectNoAxeViolations(page);
        await choose(page, "ban", "Banana");
        await expect(page.getByText("Choose a fruit.")).toHaveCount(0);
        await expect(combobox(page)).not.toHaveAttribute("aria-invalid");
        await submit(page).click();
        await expectSubmitted(page, "fruit=banana");
    });

    test("has no axe violation", async ({ page }) => {
        await expectNoAxeViolations(page);
    });
});
