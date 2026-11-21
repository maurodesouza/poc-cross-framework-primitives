import { bridgeForm } from "@poc/dom";
import {
    createEffect,
    createSignal,
    createUniqueId,
    flush,
    useContext,
} from "solid-js";
import { createControllable } from "../../hooks/create-controllable.ts";
import { createFieldControl } from "../../hooks/create-field-control.ts";
import type { ChangeDetails } from "../../utils/change-details.ts";
import { HIDDEN_INPUT_STYLE } from "../../utils/hidden-input-style.ts";
import { type PartProps, renderPart } from "../../utils/part.tsx";
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

const OWN_PROPS = [
    "checked",
    "defaultChecked",
    "onCheckedChange",
    "indeterminate",
    "disabled",
    "required",
    "name",
    "value",
    "parent",
    "id",
] as const;

/** A `checkbox` with its hidden form input (spec/checkbox.md). */
export function CheckboxRoot(props: CheckboxRootProps) {
    const group = useContext(CheckboxGroupContext);
    const generatedId = createUniqueId();
    const id = () => props.id ?? generatedId;
    const [own, setOwn] = createControllable<boolean, ChangeDetails>(
        () => props.checked,
        () => props.defaultChecked ?? false,
        (next, details) => props.onCheckedChange?.(next, details),
    );
    const [button, setButton] = createSignal<HTMLElement | null>(null);
    const [input, setInput] = createSignal<HTMLInputElement | null>(null);

    const inGroup = () =>
        group !== null && (props.parent === true || props.value !== undefined);
    const checkedState = () => {
        let checked = own();
        let indeterminate = props.indeterminate ?? false;
        if (group !== null && inGroup()) {
            const all = group.allValues();
            const current = group.value();
            const count = all.filter((entry) => current.includes(entry)).length;
            if (props.parent) {
                checked = all.length > 0 && count === all.length;
                indeterminate = count > 0 && !checked;
            } else {
                checked = current.includes(props.value as string);
            }
        }
        return { checked, indeterminate };
    };
    // before `state`, which reads its `disabled`; its effects read the value at once
    const field = createFieldControl({
        id,
        labelable: true,
        value: () => checkedState().checked,
        filled: () => checkedState().checked,
        input,
    });
    const state = (): CheckboxState => ({
        ...checkedState(),
        disabled:
            (props.disabled ?? false) ||
            (group?.disabled() ?? false) ||
            field.disabled(),
        required: props.required ?? false,
    });

    createEffect(
        () => ({ parent: props.parent, value: props.value, current: id() }),
        ({ parent, value, current }) => {
            if (group === null || parent || value === undefined) {
                return undefined;
            }
            group.registerId(value, current);
            return () => group.registerId(value, null);
        },
    );

    createEffect(input, (element) => {
        if (element === null) {
            return undefined;
        }
        return bridgeForm(element, {
            reset: () => {
                if (group !== null && inGroup()) {
                    group.reset();
                    return;
                }
                const initial = props.defaultChecked ?? false;
                setOwn(initial, { reason: "none" });
                flush();
                // the browser reset the input to its attribute: write the default back
                element.checked = state().checked;
            },
            invalid: button,
        });
    });

    const toggle = () => {
        const current = state();
        if (current.disabled) {
            return;
        }
        const next = current.indeterminate ? true : !current.checked;
        if (group === null || !inGroup()) {
            setOwn(next, { reason: "none" });
        } else if (props.parent) {
            group.setAll(next);
        } else {
            group.toggle(props.value as string, next);
        }
    };

    const controls = () =>
        group !== null && inGroup() && props.parent
            ? group
                  .allValues()
                  .map((entry) => group.ids()[entry])
                  .filter((entry) => entry !== undefined)
                  .join(" ") || undefined
            : undefined;

    return (
        <CheckboxContext value={state}>
            {renderPart(
                "button",
                props,
                state,
                () => {
                    const current = state();
                    return {
                        type: "button",
                        role: "checkbox",
                        id: id(),
                        disabled: current.disabled,
                        "aria-checked": current.indeterminate
                            ? "mixed"
                            : String(current.checked),
                        "aria-required": current.required ? "true" : undefined,
                        "aria-controls": controls(),
                        ...field.aria(),
                        "data-checkbox-part": "root",
                        ...field.attributes(),
                        ...stateAttributes({
                            ...checkedAttributes(current),
                            required: current.required,
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
                    };
                },
                { ref: (element) => setButton(element), omit: OWN_PROPS },
            )}
            {/* biome-ignore lint/a11y/noAriaHiddenOnFocusable: tabindex -1 (Solid spells it in lower case), the hidden input never takes focus */}
            <input
                ref={(element) => setInput(element)}
                type="checkbox"
                aria-hidden="true"
                tabindex={-1}
                name={props.parent ? undefined : (field.name() ?? props.name)}
                value={props.value ?? "on"}
                checked={state().checked && !(props.parent && inGroup())}
                required={state().required}
                disabled={state().disabled}
                style={HIDDEN_INPUT_STYLE}
                data-checkbox-part="input"
            />
        </CheckboxContext>
    );
}
