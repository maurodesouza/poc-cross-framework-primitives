/** A field's state, which every part carries (spec/field.md, "State attributes and ARIA"). */
export interface FieldState {
    /** `false` while it shows an error, `true` once validated and valid, `null` before or disabled. */
    valid: boolean | null;
    dirty: boolean;
    touched: boolean;
    filled: boolean;
    focused: boolean;
    disabled: boolean;
}

/** The field's state attributes, as booleans keyed by their `data-*` name (without `data-`). */
export function fieldStateAttributes(
    state: FieldState,
): Record<
    | "invalid"
    | "valid"
    | "dirty"
    | "touched"
    | "filled"
    | "focused"
    | "disabled",
    boolean
> {
    return {
        invalid: state.valid === false,
        valid: state.valid === true,
        dirty: state.dirty,
        touched: state.touched,
        filled: state.filled,
        focused: state.focused,
        disabled: state.disabled,
    };
}
