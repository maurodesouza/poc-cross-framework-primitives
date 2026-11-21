import { useCallback, useMemo, useState } from "react";
import { useControllableState } from "../../hooks/use-controllable-state.ts";
import type { ChangeDetails } from "../../utils/change-details.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { CheckboxGroupContext } from "./checkbox-group-context.ts";

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
export function CheckboxGroup({
    value: valueProp,
    defaultValue = NONE,
    onValueChange,
    allValues = NONE,
    disabled = false,
    ...props
}: CheckboxGroupProps) {
    const [value, setValue] = useControllableState<
        readonly string[],
        ChangeDetails
    >(valueProp, defaultValue, (next, details) =>
        onValueChange?.([...next], details),
    );
    const [ids, setIds] = useState<Record<string, string>>({});
    const order = useCallback(
        (values: readonly string[]) =>
            allValues.length === 0
                ? [...values]
                : [
                      ...allValues.filter((entry) => values.includes(entry)),
                      ...values.filter((entry) => !allValues.includes(entry)),
                  ],
        [allValues],
    );
    const toggle = useCallback(
        (entry: string, checked: boolean) => {
            const next = checked
                ? order([...value.filter((item) => item !== entry), entry])
                : value.filter((item) => item !== entry);
            setValue(next, { reason: "none" });
        },
        [value, order, setValue],
    );
    const setAll = useCallback(
        (checked: boolean) =>
            setValue(checked ? [...allValues] : [], { reason: "none" }),
        [allValues, setValue],
    );
    const reset = useCallback(
        () => setValue(defaultValue, { reason: "none" }),
        [defaultValue, setValue],
    );
    const registerId = useCallback((entry: string, id: string | null) => {
        setIds((current) => {
            if (id === null) {
                const { [entry]: _, ...rest } = current;
                return rest;
            }
            return current[entry] === id
                ? current
                : { ...current, [entry]: id };
        });
    }, []);
    const context = useMemo(
        () => ({
            value,
            allValues,
            disabled,
            toggle,
            setAll,
            reset,
            ids,
            registerId,
        }),
        [value, allValues, disabled, toggle, setAll, reset, ids, registerId],
    );
    const state = { disabled };
    return (
        <CheckboxGroupContext.Provider value={context}>
            {renderElement("div", props, state, {
                role: "group",
                "data-checkbox-group-part": "root",
                ...stateAttributes({ disabled }),
            })}
        </CheckboxGroupContext.Provider>
    );
}
