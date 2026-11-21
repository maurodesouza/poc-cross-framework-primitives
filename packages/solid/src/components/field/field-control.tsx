import type { FieldState } from "@poc/dom";
import { createSignal, createUniqueId, flush, useContext } from "solid-js";
import { createControllable } from "../../hooks/create-controllable.ts";
import { createFieldControl } from "../../hooks/create-field-control.ts";
import type { ChangeDetails } from "../../utils/change-details.ts";
import { type PartProps, renderPart } from "../../utils/part.tsx";
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

const OWN_PROPS = [
    "value",
    "defaultValue",
    "onValueChange",
    "id",
    "name",
    "disabled",
] as const;

const OUTSIDE_STATE: FieldState = {
    valid: null,
    dirty: false,
    touched: false,
    filled: false,
    focused: false,
    disabled: false,
};

/** The field's native input (spec/field.md); every native attribute is forwarded. */
export function FieldControl(props: FieldControlProps) {
    const generated = createUniqueId();
    const id = () => props.id ?? generated;
    const [value, setValue] = createControllable<string, ChangeDetails>(
        () => props.value,
        () => props.defaultValue ?? "",
        (next, details) => props.onValueChange?.(next, details),
    );
    const [input, setInput] = createSignal<HTMLInputElement | null>(null);
    const field = createFieldControl({
        id,
        labelable: true,
        value,
        filled: () => value() !== "",
        input,
    });
    const context = useContext(FieldContext);
    const state = () => context?.state() ?? OUTSIDE_STATE;
    const disabled = () => (props.disabled ?? false) || field.disabled();
    return renderPart(
        "input",
        props,
        state,
        () => ({
            id: id(),
            name: field.name() ?? props.name,
            disabled: disabled(),
            value: value(),
            onInput: (event: InputEvent) => {
                const element = event.currentTarget as HTMLInputElement;
                setValue(element.value, { reason: "none" });
                // a controlled `value` the consumer kept unchanged: the binding does not re-run,
                // so put the accepted text back (React re-asserts it too)
                flush();
                if (element.value !== value()) {
                    element.value = value();
                }
            },
            onFocus: field.onFocus,
            onBlur: field.onBlur,
            ...field.aria(),
            "data-field-part": "control",
            ...field.attributes(),
            // outside a field, only its own disabled state
            ...(field.inField ? {} : stateAttributes({ disabled: disabled() })),
        }),
        {
            ref: (element) => setInput(element as HTMLInputElement),
            omit: OWN_PROPS,
        },
    );
}
