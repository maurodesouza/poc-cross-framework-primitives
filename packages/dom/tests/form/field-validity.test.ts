import { beforeEach, describe, expect, it, vi } from "vitest";
import {
    shownAfterChange,
    validatesOnChange,
} from "../../src/form/field-change.ts";
import { fieldDescribedBy } from "../../src/form/field-described-by.ts";
import { fieldErrorShown } from "../../src/form/field-error-shown.ts";
import { fieldStateAttributes } from "../../src/form/field-state.ts";
import {
    CLEARED,
    UNVALIDATED,
    validateField,
} from "../../src/form/field-validity.ts";
import { onSubmitAttempt } from "../../src/form/submit-attempt.ts";

function input(html: string): HTMLInputElement {
    document.body.innerHTML = `<form>${html}</form>`;
    return document.querySelector("input") as HTMLInputElement;
}

describe("validateField", () => {
    it("ignores a lone valueMissing until the value changed", () => {
        const element = input("<input required>");
        const before = validateField(element, {
            value: "",
            valueChanged: false,
            always: false,
        });
        expect(before.validity.valid).toBe(true);
        expect(before.validity.valueMissing).toBe(false);
        const after = validateField(element, {
            value: "",
            valueChanged: true,
            always: false,
        });
        expect(after.validity.valid).toBe(false);
        expect(after.validity.valueMissing).toBe(true);
        expect(after.errors).toHaveLength(1);
    });

    it("runs validate when the native validity passes and sets the custom validity", () => {
        const element = input("<input>");
        element.value = "a";
        const result = validateField(element, {
            value: "a",
            validate: (value) => (value === "a" ? ["One.", "Two."] : null),
            valueChanged: true,
            always: false,
        });
        expect(result.validity.valid).toBe(false);
        expect(result.validity.customError).toBe(true);
        expect(result.errors).toEqual(["One.", "Two."]);
        expect(element.validity.customError).toBe(true);
        element.value = "b";
        const fixed = validateField(element, {
            value: "b",
            validate: (value) => (value === "a" ? "One." : null),
            valueChanged: true,
            always: false,
        });
        expect(fixed.validity.valid).toBe(true);
        expect(fixed.errors).toEqual([]);
        expect(element.validity.valid).toBe(true);
    });

    it("skips validate on a native error unless always", () => {
        const element = input('<input pattern="[A-Z]{3}">');
        element.value = "ab";
        const validate = vi.fn(() => "Taken.");
        const native = validateField(element, {
            value: "ab",
            validate,
            valueChanged: true,
            always: false,
        });
        expect(validate).not.toHaveBeenCalled();
        expect(native.validity.patternMismatch).toBe(true);
        expect(native.validity.customError).toBe(false);
        const both = validateField(element, {
            value: "ab",
            validate,
            valueChanged: true,
            always: true,
        });
        expect(both.validity.customError).toBe(true);
        expect(both.errors).toEqual(["Taken."]);
    });

    it("lets validate alone decide for an element the browser cannot validate", () => {
        const element = input('<input type="hidden">');
        const result = validateField(element, {
            value: 5,
            validate: (value) => (value === 5 ? "Too low." : null),
            valueChanged: true,
            always: false,
        });
        expect(result.validity.valid).toBe(false);
        expect(result.errors).toEqual(["Too low."]);
        expect(
            validateField(null, { value: 1, valueChanged: true, always: false })
                .validity.valid,
        ).toBe(true);
    });
});

describe("the change rules", () => {
    const invalid = validateField(input("<input required>"), {
        value: "",
        valueChanged: true,
        always: false,
    });

    it("validates on change in onChange mode, and in onSubmit mode after a submission", () => {
        expect(validatesOnChange("onChange", false)).toBe(true);
        expect(validatesOnChange("onSubmit", false)).toBe(false);
        expect(validatesOnChange("onSubmit", true)).toBe(true);
        expect(validatesOnChange("onBlur", true)).toBe(false);
    });

    it("a change clears a shown error, unless the value is missing", () => {
        const element = input("<input required>");
        element.value = "x";
        const next = validateField(element, {
            value: "x",
            validate: () => "Bad.",
            valueChanged: true,
            always: false,
        });
        expect(shownAfterChange(invalid, next, false)).toBe(CLEARED);
        expect(shownAfterChange(invalid, invalid, false)).toBe(invalid);
        expect(shownAfterChange(UNVALIDATED, next, false)).toBe(UNVALIDATED);
        expect(shownAfterChange(UNVALIDATED, next, true)).toBe(next);
    });
});

describe("fieldErrorShown", () => {
    const invalid = validateField(input("<input required>"), {
        value: "",
        valueChanged: true,
        always: false,
    });
    const field = { invalid: false, disabled: false };

    it("matches a key, the invalid state, or always", () => {
        expect(fieldErrorShown(undefined, invalid, field)).toBe(true);
        expect(fieldErrorShown("valueMissing", invalid, field)).toBe(true);
        expect(fieldErrorShown("typeMismatch", invalid, field)).toBe(false);
        expect(fieldErrorShown(undefined, UNVALIDATED, field)).toBe(false);
        expect(
            fieldErrorShown(undefined, UNVALIDATED, {
                invalid: true,
                disabled: false,
            }),
        ).toBe(true);
        expect(fieldErrorShown(true, UNVALIDATED, field)).toBe(true);
        expect(
            fieldErrorShown(undefined, invalid, {
                invalid: false,
                disabled: true,
            }),
        ).toBe(false);
    });
});

describe("the field's attributes and description", () => {
    it("maps the state to its attributes", () => {
        expect(
            fieldStateAttributes({
                valid: false,
                dirty: true,
                touched: false,
                filled: true,
                focused: false,
                disabled: false,
            }),
        ).toEqual({
            invalid: true,
            valid: false,
            dirty: true,
            touched: false,
            filled: true,
            focused: false,
            disabled: false,
        });
    });

    it("lists the ids in document order", () => {
        document.body.innerHTML =
            '<p id="a"></p><div id="b"></div><div id="c"></div>';
        const [a, b, c] = ["a", "b", "c"].map(
            (id) => document.getElementById(id) as HTMLElement,
        ) as [HTMLElement, HTMLElement, HTMLElement];
        expect(fieldDescribedBy([c, a, b])).toBe("a b c");
        expect(fieldDescribedBy([])).toBeUndefined();
    });
});

describe("onSubmitAttempt", () => {
    beforeEach(() => {
        document.body.innerHTML =
            '<form><input required><button type="submit">Go</button></form>';
    });

    it("reports a blocked submission and a submission, until cleaned up", () => {
        const form = document.querySelector("form") as HTMLFormElement;
        const attempt = vi.fn();
        const end = onSubmitAttempt(form, attempt);
        form.checkValidity();
        expect(attempt).toHaveBeenCalledOnce();
        form.dispatchEvent(new Event("submit"));
        expect(attempt).toHaveBeenCalledTimes(2);
        end();
        form.checkValidity();
        expect(attempt).toHaveBeenCalledTimes(2);
    });
});
