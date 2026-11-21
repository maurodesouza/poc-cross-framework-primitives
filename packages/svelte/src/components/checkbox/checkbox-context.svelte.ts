import { createContext } from "../../utils/context.ts";

export interface CheckboxState {
    readonly checked: boolean;
    readonly indeterminate: boolean;
    readonly disabled: boolean;
    readonly required: boolean;
}

export const CheckboxContext = createContext<CheckboxState>("Checkbox");

/** `data-checked` / `data-unchecked` / `data-indeterminate`: exactly one (spec/checkbox.md). */
export function checkedAttributes(state: CheckboxState) {
    return {
        checked: state.checked && !state.indeterminate,
        unchecked: !state.checked && !state.indeterminate,
        indeterminate: state.indeterminate,
        disabled: state.disabled,
    };
}
