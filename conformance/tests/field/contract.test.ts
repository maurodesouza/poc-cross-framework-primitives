import { expect, type Locator, type Page, test } from "@playwright/test";
import { expectNoFalseStates, part } from "../../src/contract.ts";
import { openScenario } from "../../src/scenario.ts";

// spec/field.md: anatomy, state attributes, ARIA wiring, the integration contract
const FIELD_STATES = [
    "invalid",
    "valid",
    "dirty",
    "touched",
    "filled",
    "focused",
    "disabled",
] as const;

/** The field states present on an element, in the spec's order. */
async function fieldStates(locator: Locator): Promise<string[]> {
    return locator.evaluate(
        (element, names) =>
            names.filter((name) => element.hasAttribute(`data-${name}`)),
        [...FIELD_STATES],
    );
}

/** Every field part of the field with this root, and its control, carry `states`. */
async function expectStates(
    elements: readonly Locator[],
    states: readonly string[],
): Promise<void> {
    for (const element of elements) {
        await expect.poll(() => fieldStates(element)).toEqual([...states]);
    }
}

/** Each element has every state of `present` and none of `absent`. */
async function expectHas(
    elements: readonly Locator[],
    present: readonly string[],
    absent: readonly string[],
): Promise<void> {
    for (const element of elements) {
        await expect
            .poll(async () => {
                const states = await fieldStates(element);
                return (
                    present.every((name) => states.includes(name)) &&
                    absent.every((name) => !states.includes(name))
                );
            })
            .toBe(true);
    }
}

const roots = (page: Page) => part(page, "field", "root");

test("field / basic: parts, ids and the ARIA wiring", async ({ page }) => {
    await openScenario(page, "/field/basic");
    await expect(roots(page)).toHaveCount(2);
    const field = roots(page).nth(0);
    const label = part(field, "field", "label");
    const control = part(field, "field", "control");
    const description = part(field, "field", "description");
    await expect(label).toHaveJSProperty("tagName", "LABEL");
    await expect(control).toHaveJSProperty("tagName", "INPUT");
    await expect(description).toHaveJSProperty("tagName", "P");
    await expect(part(field, "field", "error")).toHaveCount(0);

    const controlId = await control.getAttribute("id");
    const labelId = await label.getAttribute("id");
    const descriptionId = await description.getAttribute("id");
    expect(controlId).toBeTruthy();
    expect(labelId).toBeTruthy();
    expect(descriptionId).toBeTruthy();
    await expect(label).toHaveAttribute("for", controlId as string);
    await expect(control).toHaveAttribute("aria-labelledby", labelId as string);
    await expect(control).toHaveAttribute(
        "aria-describedby",
        descriptionId as string,
    );
    await expect(control).toHaveAttribute("name", "email");
    await expect(control).not.toHaveAttribute("aria-invalid");

    await page.getByRole("button", { name: "Submit" }).click();
    const error = part(field, "field", "error");
    await expect(error).toHaveCount(1);
    await expect(error).toHaveJSProperty("tagName", "DIV");
    const errorId = await error.getAttribute("id");
    expect(errorId).toBeTruthy();
    await expect(control).toHaveAttribute(
        "aria-describedby",
        `${descriptionId} ${errorId}`,
    );
    await expect(control).toHaveAttribute("aria-invalid", "true");
    await expectNoFalseStates(page.locator("[data-field-part]"));
});

test("field / basic: the field states on every part", async ({ page }) => {
    await openScenario(page, "/field/basic");
    const field = roots(page).nth(0);
    const control = part(field, "field", "control");
    const parts = [
        field,
        part(field, "field", "label"),
        control,
        part(field, "field", "description"),
    ];
    await expectStates(parts, []);

    await control.focus();
    await expectStates(parts, ["focused"]);
    await page.keyboard.type("a");
    await expectStates(parts, ["dirty", "filled", "focused"]);
    await page.keyboard.press("Backspace");
    await expectStates(parts, ["focused"]);
    await page.keyboard.press("Tab");
    await expectStates(parts, ["touched"]);

    await page.getByRole("button", { name: "Submit" }).click();
    await expectStates(
        [...parts, part(field, "field", "error")],
        ["invalid", "touched", "focused"],
    );
    await control.fill("ada@example.com");
    await expectStates(parts, [
        "valid",
        "dirty",
        "touched",
        "filled",
        "focused",
    ]);
    await expectNoFalseStates(page.locator("[data-field-part]"));
});

test("field / basic: a disabled field", async ({ page }) => {
    await openScenario(page, "/field/basic");
    const field = roots(page).nth(1);
    const control = part(field, "field", "control");
    await expect(control).toBeDisabled();
    await expect(control).toHaveAttribute("name", "nickname");
    await expectStates(
        [
            field,
            part(field, "field", "label"),
            control,
            part(field, "field", "description"),
        ],
        ["disabled"],
    );
});

test("field / validation: several messages render as a list", async ({
    page,
}) => {
    await openScenario(page, "/field/validation");
    const password = page.getByRole("textbox", { name: "Password" });
    await password.fill("abc");
    await page.keyboard.press("Tab");
    const field = roots(page).filter({ has: password });
    const error = part(field, "field", "error");
    await expect(error.locator("ul > li")).toHaveCount(2);
    await expectStates(
        [field, error],
        ["invalid", "dirty", "touched", "filled"],
    );
    await expectNoFalseStates(page.locator("[data-field-part]"));
});

test("field / controls: the integrated controls take the field's ids, name and states", async ({
    page,
}) => {
    await openScenario(page, "/field/controls");
    await expect(roots(page)).toHaveCount(3);

    const [terms, fruit, volume] = [0, 1, 2].map((index) =>
        roots(page).nth(index),
    ) as [Locator, Locator, Locator];

    const checkbox = part(terms, "checkbox", "root");
    const termsLabel = part(terms, "field", "label");
    await expect(termsLabel).toHaveAttribute(
        "for",
        (await checkbox.getAttribute("id")) as string,
    );
    await expect(checkbox).toHaveAttribute(
        "aria-labelledby",
        (await termsLabel.getAttribute("id")) as string,
    );
    await expect(part(terms, "checkbox", "input")).toHaveAttribute(
        "name",
        "terms",
    );

    const trigger = part(fruit, "select", "trigger");
    const fruitLabel = part(fruit, "field", "label");
    await expect(fruitLabel).toHaveAttribute(
        "for",
        (await trigger.getAttribute("id")) as string,
    );
    await expect(trigger).toHaveAttribute(
        "aria-labelledby",
        (await fruitLabel.getAttribute("id")) as string,
    );
    await expect(part(fruit, "select", "input")).toHaveAttribute(
        "name",
        "fruit",
    );

    const slider = part(volume, "slider", "root");
    const thumb = part(volume, "slider", "thumb");
    const volumeLabel = part(volume, "field", "label");
    const volumeLabelId = (await volumeLabel.getAttribute("id")) as string;
    await expect(volumeLabel).not.toHaveAttribute("for");
    await expect(slider).toHaveAttribute("aria-labelledby", volumeLabelId);
    await expect(thumb).toHaveAttribute("aria-labelledby", volumeLabelId);
    await expect(thumb).toHaveAttribute(
        "aria-describedby",
        (await part(volume, "field", "description").getAttribute(
            "id",
        )) as string,
    );
    await expect(part(volume, "slider", "input")).toHaveAttribute(
        "name",
        "volume",
    );

    await expectStates([checkbox, trigger], []);
    await expectStates([slider], ["filled"]);

    await page.getByRole("button", { name: "Submit" }).click();
    // which control the failed submission focuses last is not part of the contract
    await expectHas([terms, checkbox, fruit, trigger], ["invalid"], ["valid"]);
    await expectHas([volume, slider], ["valid", "filled"], ["invalid"]);

    await checkbox.click();
    await expectHas(
        [terms, checkbox],
        ["valid", "dirty", "filled", "focused"],
        ["invalid"],
    );
    await thumb.focus();
    await expectHas([terms, checkbox], ["touched"], ["focused"]);
    await expectHas([volume, slider], ["focused"], ["dirty"]);
    await page.keyboard.press("ArrowRight");
    await expectHas([volume, slider], ["dirty", "filled", "focused"], []);
    await expectNoFalseStates(
        page.locator(
            "[data-field-part], [data-checkbox-part], [data-select-part], [data-slider-part]",
        ),
    );
});
