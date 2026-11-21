import { expect, type Page, test } from "@playwright/test";
import { expectNoAxeViolations } from "../../src/axe.ts";
import { baselineDeviation } from "../../src/deviation.ts";
import { expectSubmitted } from "../../src/form.ts";
import { expectOutput } from "../../src/output.ts";
import { openScenario } from "../../src/scenario.ts";

// spec/select.md
const trigger = (page: Page) => page.getByRole("combobox", { name: "Fruit" });
const listbox = (page: Page) => page.getByRole("listbox");
const option = (page: Page, name: string) =>
    page.getByRole("option", { name, exact: true });

/** The highlighted option, as the trigger announces it (`aria-activedescendant`). */
async function expectHighlighted(page: Page, name: string) {
    const id = await option(page, name).getAttribute("id");
    expect(id).not.toBeNull();
    await expect(trigger(page)).toHaveAttribute(
        "aria-activedescendant",
        id as string,
    );
}

test.describe("select / basic", () => {
    test.beforeEach(async ({ page }) => {
        await openScenario(page, "/select/basic");
    });

    test("a named, collapsed select-only combobox showing its placeholder", async ({
        page,
    }) => {
        await expect(trigger(page)).toHaveAttribute("aria-expanded", "false");
        await expect(trigger(page)).toHaveAttribute("aria-haspopup", "listbox");
        await expect(trigger(page)).toHaveText("Choose a fruit");
        // the hidden input is not in the accessibility tree
        await expect(page.getByRole("combobox")).toHaveCount(1);
        await expect(page.getByRole("textbox")).toHaveCount(0);
        await expect(page.getByRole("button")).toHaveCount(2);
    });

    test("a click opens the list; focus stays on the trigger, which points at the highlight", async ({
        page,
    }) => {
        baselineDeviation(
            "Base UI moves DOM focus into the list instead of aria-activedescendant (spec/select.md, Baseline deviations)",
        );
        await trigger(page).click();
        await expect(listbox(page)).toBeVisible();
        await expect(page.getByRole("option")).toHaveText([
            "Apple",
            "Banana",
            "Blueberry",
            "Cherry",
            "Grape",
            "Mango",
            "Orange",
        ]);
        await expect(trigger(page)).toHaveAttribute("aria-expanded", "true");
        await expect(trigger(page)).toBeFocused();
        await expectHighlighted(page, "Apple");
    });

    test("the popup sits below the trigger, aligned with it, at least as wide", async ({
        page,
    }) => {
        await trigger(page).click();
        await expect(listbox(page)).toBeVisible();
        const box = await trigger(page).boundingBox();
        const list = await listbox(page).boundingBox();
        expect(box).not.toBeNull();
        expect(list).not.toBeNull();
        const t = box as NonNullable<typeof box>;
        const l = list as NonNullable<typeof list>;
        expect(l.y).toBeGreaterThanOrEqual(t.y + t.height - 1);
        expect(Math.abs(l.x - t.x)).toBeLessThanOrEqual(1);
        // the list sits inside the popup's border
        expect(l.width).toBeGreaterThanOrEqual(t.width - 2);
    });

    test("ArrowDown opens it, Enter chooses; focus stays on the trigger", async ({
        page,
    }) => {
        await trigger(page).focus();
        await page.keyboard.press("ArrowDown");
        await expect(listbox(page)).toBeVisible();
        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("Enter");
        await expectOutput(page, "value", "banana");
        await expect(trigger(page)).toHaveText("Banana");
        await expect(listbox(page)).toBeHidden();
        await expect(trigger(page)).toBeFocused();
    });

    test("reopened, the selected option is highlighted and selected", async ({
        page,
    }) => {
        await trigger(page).click();
        await option(page, "Banana").click();
        await expectOutput(page, "value", "banana");
        await trigger(page).focus();
        await page.keyboard.press("ArrowDown");
        await expect(option(page, "Banana")).toHaveAttribute(
            "aria-selected",
            "true",
        );
        // the selection is what Enter chooses again, and ArrowDown moves on from it
        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("Enter");
        await expectOutput(page, "value", "blueberry");
    });

    test("typeahead, Home and End", async ({ page }) => {
        await trigger(page).click();
        await expect(listbox(page)).toBeVisible();
        await page.keyboard.type("m");
        await page.keyboard.press("Enter");
        await expectOutput(page, "value", "mango");
        await trigger(page).focus();
        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("Home");
        await page.keyboard.press("Enter");
        await expectOutput(page, "value", "apple");
    });

    test("a disabled option cannot be chosen", async ({ page }) => {
        await trigger(page).click();
        await expect(option(page, "Orange")).toHaveAttribute(
            "aria-disabled",
            "true",
        );
        await option(page, "Orange").click({ force: true });
        await expect(listbox(page)).toBeVisible();
        await expectOutput(page, "value", "none");
    });

    test("Escape closes without choosing", async ({ page }) => {
        await trigger(page).focus();
        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("Escape");
        await expect(listbox(page)).toBeHidden();
        await expectOutput(page, "reason", "escape-key");
        await expectOutput(page, "value", "none");
        await expect(trigger(page)).toBeFocused();
    });

    test("a click chooses; an outside press closes", async ({ page }) => {
        baselineDeviation(
            "Base UI reports an outside press as cancel-open (spec/select.md, Baseline deviations)",
        );
        await trigger(page).click();
        await option(page, "Cherry").click();
        await expectOutput(page, "value", "cherry");
        await expect(trigger(page)).toHaveText("Cherry");
        await trigger(page).click();
        await expect(listbox(page)).toBeVisible();
        await page.mouse.click(400, 400);
        await expect(listbox(page)).toBeHidden();
        await expectOutput(page, "reason", "outside-press");
    });

    test("Tab chooses the highlighted option and moves on", async ({
        page,
    }) => {
        baselineDeviation(
            "Base UI's Tab closes without choosing (spec/select.md, Baseline deviations)",
        );
        await trigger(page).focus();
        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("Tab");
        await expect(listbox(page)).toBeHidden();
        await expectOutput(page, "value", "banana");
    });

    test("required blocks the submission and focuses the trigger; then it submits", async ({
        page,
    }) => {
        await page.getByRole("button", { name: "Submit" }).click();
        await expect(trigger(page)).toBeFocused();
        await expectSubmitted(page, "none");
        await trigger(page).click();
        await option(page, "Banana").click();
        await page.getByRole("button", { name: "Submit" }).click();
        await expectSubmitted(page, "fruit=banana");
    });

    test("a form reset shows the placeholder again", async ({ page }) => {
        baselineDeviation(
            "Base UI's Select ignores a form reset (spec/select.md, Baseline deviations)",
        );
        await trigger(page).click();
        await option(page, "Banana").click();
        await expect(trigger(page)).toHaveText("Banana");
        await page.getByRole("button", { name: "Reset" }).click();
        await expect(trigger(page)).toHaveText("Choose a fruit");
        await expectOutput(page, "value", "none");
    });

    test("has no axe violation, closed and open", async ({ page }) => {
        await expectNoAxeViolations(page);
        await trigger(page).click();
        await expect(listbox(page)).toBeVisible();
        await expectNoAxeViolations(page);
    });
});

test("select / controlled: a value the consumer refuses is not shown", async ({
    page,
}) => {
    await openScenario(page, "/select/controlled");
    await expect(trigger(page)).toHaveText("Apple");
    await trigger(page).click();
    await option(page, "Cherry").click();
    await expectOutput(page, "requested", "cherry");
    await expect(listbox(page)).toBeHidden();
    await expect(trigger(page)).toHaveText("Apple");
    await expectOutput(page, "value", "apple");
    await trigger(page).click();
    await option(page, "Banana").click();
    await expect(trigger(page)).toHaveText("Banana");
});
