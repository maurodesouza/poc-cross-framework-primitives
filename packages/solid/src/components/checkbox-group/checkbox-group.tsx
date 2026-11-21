import { createSignal } from "solid-js";
import { createControllable } from "../../hooks/create-controllable.ts";
import type { ChangeDetails } from "../../utils/change-details.ts";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import {
    CheckboxGroupContext,
    type CheckboxGroupContextValue,
} from "./checkbox-group-context.ts";

export interface CheckboxGroupState {
    disabled: boolean;
}

export interface CheckboxGroupProps extends PartProps<CheckboxGroupState> {
    value?: readonly string[];
    defaultValue?: readonly string[];
    onValueChange?: (value: string[], details: ChangeDetails) => void;
    /** Every child value: what the parent checkbox checks. */
    allValues?: readonly string[];
    disabled?: boolean;
}

const NONE: readonly string[] = [];

/** Checkboxes sharing one array value, with an optional parent (spec/checkbox.md). */
export function CheckboxGroup(props: CheckboxGroupProps) {
    const [value, setValue] = createControllable<
        readonly string[],
        ChangeDetails
    >(
        () => props.value,
        () => props.defaultValue ?? NONE,
        (next, details) => props.onValueChange?.([...next], details),
    );
    const [ids, setIds] = createSignal<Record<string, string>>({});
    const allValues = () => props.allValues ?? NONE;
    const order = (values: readonly string[]) => {
        const all = allValues();
        return all.length === 0
            ? [...values]
            : [
                  ...all.filter((entry) => values.includes(entry)),
                  ...values.filter((entry) => !all.includes(entry)),
              ];
    };
    const disabled = () => props.disabled ?? false;
    const context: CheckboxGroupContextValue = {
        value,
        allValues,
        disabled,
        toggle: (entry, checked) => {
            const current = value();
            const next = checked
                ? order([...current.filter((item) => item !== entry), entry])
                : current.filter((item) => item !== entry);
            setValue(next, { reason: "none" });
        },
        setAll: (checked) =>
            setValue(checked ? [...allValues()] : [], { reason: "none" }),
        reset: () => setValue(props.defaultValue ?? NONE, { reason: "none" }),
        ids,
        registerId: (entry, id) =>
            setIds((current) => {
                if (id === null) {
                    const { [entry]: _, ...rest } = current;
                    return rest;
                }
                return current[entry] === id
                    ? current
                    : { ...current, [entry]: id };
            }),
    };
    const state = () => ({ disabled: disabled() });
    return (
        <CheckboxGroupContext value={context}>
            {renderPart(
                "div",
                props,
                state,
                () => ({
                    role: "group",
                    "data-checkbox-group-part": "root",
                    ...stateAttributes(state()),
                }),
                {
                    omit: [
                        "value",
                        "defaultValue",
                        "onValueChange",
                        "allValues",
                        "disabled",
                    ],
                },
            )}
        </CheckboxGroupContext>
    );
}
