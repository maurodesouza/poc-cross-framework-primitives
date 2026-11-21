import { createContext } from "solid-js";

export interface CheckboxState {
    checked: boolean;
    indeterminate: boolean;
    disabled: boolean;
    required: boolean;
}

export const CheckboxContext = createContext<() => CheckboxState>();

/** `data-checked` / `data-unchecked` / `data-indeterminate`: exactly one (spec/checkbox.md). */
export function checkedAttributes(state: CheckboxState) {
    return {
        checked: state.checked && !state.indeterminate,
        unchecked: !state.checked && !state.indeterminate,
        indeterminate: state.indeterminate,
        disabled: state.disabled,
    };
}
