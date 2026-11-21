import type { FieldValidation, ValidityKey } from "./field-validity.ts";

/** `Field.Error`'s `match`: a `ValidityState` key, or `true` for always (spec/field.md). */
export type FieldErrorMatch = ValidityKey | true;

/**
 * Whether a `Field.Error` is shown: always with `match={true}`; never in a disabled field;
 * with a key, while that key is set; without, while the field is invalid (its validity is `false`,
 * or the app set `invalid`).
 */
export function fieldErrorShown(
    match: FieldErrorMatch | undefined,
    shown: FieldValidation,
    field: { invalid: boolean; disabled: boolean },
): boolean {
    if (match === true) {
        return true;
    }
    if (field.disabled) {
        return false;
    }
    if (match !== undefined) {
        return shown.validity[match];
    }
    return field.invalid || shown.validity.valid === false;
}
