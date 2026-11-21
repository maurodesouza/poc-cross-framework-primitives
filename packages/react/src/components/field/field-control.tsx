import type { FieldState } from "@poc/dom";
import { type ChangeEvent, useContext, useId, useRef } from "react";
import { useControllableState } from "../../hooks/use-controllable-state.ts";
import { useFieldControl } from "../../hooks/use-field-control.ts";
import type { ChangeDetails } from "../../utils/change-details.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { FieldContext } from "./field-context.ts";

export interface FieldControlProps extends PartProps<FieldState> {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string, details: ChangeDetails) => void;
    id?: string;
    name?: string;
    disabled?: boolean;
}

const OUTSIDE_STATE: FieldState = {
    valid: null,
    dirty: false,
    touched: false,
    filled: false,
    focused: false,
    disabled: false,
};

/** The field's native input (spec/field.md); every native attribute is forwarded. */
export function FieldControl({
    value: valueProp,
    defaultValue = "",
    onValueChange,
    id: idProp,
    name,
    disabled: disabledProp = false,
    ...props
}: FieldControlProps) {
    const generated = useId();
    const id = idProp ?? generated;
    const [value, setValue] = useControllableState(
        valueProp,
        defaultValue,
        onValueChange,
    );
    const input = useRef<HTMLInputElement | null>(null);
    const field = useFieldControl({
        id,
        labelable: true,
        value,
        filled: value !== "",
        input: () => input.current,
    });
    const state = useContext(FieldContext)?.state ?? OUTSIDE_STATE;
    const disabled = disabledProp || field.disabled;
    return renderElement(
        "input",
        props,
        state,
        {
            id,
            name: field.name ?? name,
            disabled,
            value,
            onChange: (event: ChangeEvent<HTMLInputElement>) =>
                setValue(event.currentTarget.value, { reason: "none" }),
            onFocus: field.onFocus,
            onBlur: field.onBlur,
            ...field.aria,
            "data-field-part": "control",
            ...field.attributes,
            // outside a field, only its own disabled state
            ...(field.inField ? {} : stateAttributes({ disabled })),
        },
        (element: HTMLElement | null) => {
            input.current = element as HTMLInputElement | null;
        },
    );
}
