import { bridgeForm, VISUALLY_HIDDEN_INPUT_STYLE } from "@poc/dom";
import {
    type KeyboardEvent,
    useContext,
    useEffect,
    useId,
    useRef,
} from "react";
import { useControllableState } from "../../hooks/use-controllable-state.ts";
import { useElement } from "../../hooks/use-element.ts";
import { useFieldControl } from "../../hooks/use-field-control.ts";
import type { ChangeDetails } from "../../utils/change-details.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { CheckboxGroupContext } from "../checkbox-group/checkbox-group-context.ts";
import {
    CheckboxContext,
    type CheckboxState,
    checkedAttributes,
} from "./checkbox-context.ts";

export interface CheckboxRootProps extends PartProps<CheckboxState> {
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean, details: ChangeDetails) => void;
    indeterminate?: boolean;
    disabled?: boolean;
    required?: boolean;
    name?: string;
    /** Submitted while checked (`"on"`); inside a CheckboxGroup, its value in the group's array. */
    value?: string;
    /** The CheckboxGroup's parent checkbox. */
    parent?: boolean;
    id?: string;
}

const NOOP = () => {};

/** A `checkbox` with its hidden form input (spec/checkbox.md). */
export function CheckboxRoot({
    checked: checkedProp,
    defaultChecked = false,
    onCheckedChange,
    indeterminate: indeterminateProp = false,
    disabled: disabledProp = false,
    required = false,
    name,
    value,
    parent = false,
    id: idProp,
    children,
    ...props
}: CheckboxRootProps) {
    const group = useContext(CheckboxGroupContext);
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const [own, setOwn] = useControllableState(
        checkedProp,
        defaultChecked,
        onCheckedChange,
    );
    const [button, buttonRef] = useElement<HTMLElement>();
    const input = useRef<HTMLInputElement>(null);

    const inGroup = group !== null && (parent || value !== undefined);
    const groupChecked = group?.allValues.filter((entry) =>
        group.value.includes(entry),
    ).length;
    const checked = !inGroup
        ? own
        : parent
          ? groupChecked === group.allValues.length &&
            group.allValues.length > 0
          : group.value.includes(value as string);
    const indeterminate =
        inGroup && parent
            ? (groupChecked ?? 0) > 0 && !checked
            : indeterminateProp;
    const field = useFieldControl({
        id,
        labelable: true,
        value: checked,
        filled: checked,
        input: () => input.current,
    });
    const disabled =
        disabledProp || (group?.disabled ?? false) || field.disabled;

    const { registerId } = group ?? {};
    useEffect(() => {
        if (registerId === undefined || parent || value === undefined) {
            return undefined;
        }
        registerId(value, id);
        return () => registerId(value, null);
    }, [registerId, parent, value, id]);

    const toggle = () => {
        if (disabled) {
            return;
        }
        const next = indeterminate ? true : !checked;
        if (!inGroup) {
            setOwn(next, { reason: "none" });
        } else if (parent) {
            group.setAll(next);
        } else {
            group.toggle(value as string, next);
        }
    };

    const latest = useRef({ group, inGroup, defaultChecked, setOwn });
    latest.current = { group, inGroup, defaultChecked, setOwn };
    useEffect(() => {
        const element = input.current;
        if (element === null) {
            return undefined;
        }
        return bridgeForm(element, {
            reset: () => {
                const current = latest.current;
                if (current.inGroup) {
                    current.group?.reset();
                    return;
                }
                current.setOwn(current.defaultChecked, { reason: "none" });
                element.checked = current.defaultChecked;
            },
            invalid: () => button,
        });
    }, [button]);

    const state = { checked, indeterminate, disabled, required };
    const controls =
        inGroup && parent
            ? group.allValues
                  .map((entry) => group.ids[entry])
                  .filter((entry): entry is string => entry !== undefined)
                  .join(" ") || undefined
            : undefined;
    return (
        <CheckboxContext.Provider value={state}>
            {renderElement(
                "button",
                { ...props, children },
                state,
                {
                    type: "button",
                    role: "checkbox",
                    id,
                    disabled,
                    "aria-checked": indeterminate ? "mixed" : checked,
                    "aria-required": required ? "true" : undefined,
                    "aria-controls": controls,
                    ...field.aria,
                    "data-checkbox-part": "root",
                    ...field.attributes,
                    ...stateAttributes({
                        ...checkedAttributes(state),
                        required,
                    }),
                    onClick: toggle,
                    onFocus: field.onFocus,
                    onBlur: field.onBlur,
                    onKeyDown: (event: KeyboardEvent) => {
                        // APG: Space toggles, Enter does not (a button would click on Enter)
                        if (event.key === "Enter") {
                            event.preventDefault();
                        }
                    },
                },
                buttonRef,
            )}
            <input
                ref={input}
                type="checkbox"
                aria-hidden="true"
                tabIndex={-1}
                name={parent ? undefined : (field.name ?? name)}
                value={value ?? "on"}
                checked={checked && !(parent && inGroup)}
                required={required}
                disabled={disabled}
                onChange={NOOP}
                style={VISUALLY_HIDDEN_INPUT_STYLE}
                data-checkbox-part="input"
            />
        </CheckboxContext.Provider>
    );
}
