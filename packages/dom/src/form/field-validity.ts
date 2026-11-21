/** The `ValidityState` keys a field reads (spec/field.md, "Validation"), `valid` aside. */
export const VALIDITY_KEYS = [
    "badInput",
    "customError",
    "patternMismatch",
    "rangeOverflow",
    "rangeUnderflow",
    "stepMismatch",
    "tooLong",
    "tooShort",
    "typeMismatch",
    "valueMissing",
] as const;

export type ValidityKey = (typeof VALIDITY_KEYS)[number];

/** A field's validity: the native flags, plus `valid` (`null` before the first validation). */
export type FieldValidity = Readonly<Record<ValidityKey, boolean>> & {
    readonly valid: boolean | null;
};

/** What a field shows: its validity and its messages (empty while valid). */
export interface FieldValidation {
    readonly validity: FieldValidity;
    readonly errors: readonly string[];
}

/** A field's `validate`: a message, a list of messages, or none. */
export type FieldValidate = (
    value: unknown,
) => string | readonly string[] | null | undefined;

const NO_FLAGS = Object.fromEntries(
    VALIDITY_KEYS.map((key) => [key, false]),
) as Record<ValidityKey, boolean>;

/** Before the first validation: neither valid nor invalid. */
export const UNVALIDATED: FieldValidation = {
    validity: { ...NO_FLAGS, valid: null },
    errors: [],
};

/** Valid, with no message: what a change that clears a shown error leaves. */
export const CLEARED: FieldValidation = {
    validity: { ...NO_FLAGS, valid: true },
    errors: [],
};

export interface ValidateFieldOptions {
    /** The control's value, given to `validate`. */
    value: unknown;
    validate?: FieldValidate | undefined;
    /**
     * Whether the value has changed once or a submission was attempted. Until then, a
     * `valueMissing` alone counts as valid (the required rule).
     */
    valueChanged: boolean;
    /** Runs `validate` even when the native validity has an error (the field validates on change). */
    always: boolean;
}

function messagesOf(result: ReturnType<FieldValidate>): string[] {
    if (result === null || result === undefined) {
        return [];
    }
    // a message appears once, however often `validate` returns it
    return [...new Set(typeof result === "string" ? [result] : result)].filter(
        (message) => message !== "",
    );
}

/**
 * Validates a field (spec/field.md, "Validation"): reads the native validity of the element the
 * form validates, applies the required rule, runs `validate`, and sets its messages as the
 * element's custom validity, so a native submission is blocked by them. `element` is `null` (or
 * barred from validation, as a `type="hidden"` input) for a control the browser cannot validate:
 * `validate` alone decides. Returns what the field would show.
 */
export function validateField(
    element: HTMLInputElement | null,
    options: ValidateFieldOptions,
): FieldValidation {
    element?.setCustomValidity("");
    const native = element?.willValidate ? element.validity : null;
    const flags = { ...NO_FLAGS };
    for (const key of VALIDITY_KEYS) {
        flags[key] = native?.[key] ?? false;
    }
    const onlyMissing =
        flags.valueMissing &&
        VALIDITY_KEYS.every((key) => key === "valueMissing" || !flags[key]);
    if (onlyMissing && !options.valueChanged) {
        flags.valueMissing = false;
    }
    const nativeInvalid = VALIDITY_KEYS.some((key) => flags[key]);
    const nativeErrors =
        nativeInvalid && element !== null && element.validationMessage !== ""
            ? [element.validationMessage]
            : [];
    let errors = nativeErrors;
    if (!nativeInvalid || options.always) {
        const messages = messagesOf(options.validate?.(options.value));
        if (messages.length > 0) {
            flags.customError = true;
            element?.setCustomValidity(messages.join("\n"));
            errors = messages;
        }
    }
    const valid = !VALIDITY_KEYS.some((key) => flags[key]);
    return { validity: { ...flags, valid }, errors: valid ? [] : errors };
}
