<script lang="ts">
import { bridgeForm } from "@poc/dom";
import { untrack } from "svelte";
import type { ChangeDetails } from "../../utils/change-details.ts";
import { Controllable } from "../../utils/controllable.svelte.ts";
import { elementRef } from "../../utils/element-ref.ts";
import { HIDDEN_INPUT_STYLE } from "../../utils/hidden-input-style.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { CheckboxGroupContext } from "../checkbox-group/checkbox-group-context.svelte.ts";
import {
    CheckboxContext,
    type CheckboxState,
    checkedAttributes,
} from "./checkbox-context.svelte.ts";

/** A `checkbox` (`bind:checked`) with its hidden form input (spec/checkbox.md). */
let {
    child,
    children,
    checked: checkedProp = $bindable(),
    defaultChecked = false,
    onCheckedChange,
    indeterminate: indeterminateProp = false,
    disabled: disabledProp = false,
    required = false,
    name,
    value,
    parent = false,
    id: idProp,
    ...rest
}: PartProps<CheckboxState> & {
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
} = $props();

const generatedId = $props.id();
const id = $derived(idProp ?? generatedId);
const group = CheckboxGroupContext.maybe();
const own = new Controllable(
    () => checkedProp,
    (next) => (checkedProp = next),
    untrack(() => defaultChecked),
);
let button = $state<HTMLElement | null>(null);
let input = $state<HTMLInputElement | null>(null);
const ref = elementRef((element) => (button = element));

const inGroup = $derived(
    group !== undefined && (parent || value !== undefined),
);
const groupChecked = $derived(
    group === undefined
        ? 0
        : group.allValues.filter((entry) => group.value.includes(entry)).length,
);
const checked = $derived(
    !inGroup || group === undefined
        ? own.value
        : parent
          ? groupChecked === group.allValues.length &&
            group.allValues.length > 0
          : group.value.includes(value as string),
);
const indeterminate = $derived(
    inGroup && parent ? groupChecked > 0 && !checked : indeterminateProp,
);
const disabled = $derived(disabledProp || (group?.disabled ?? false));
const inputChecked = $derived(checked && !(parent && inGroup));

$effect(() => {
    if (group === undefined || parent || value === undefined) {
        return undefined;
    }
    const entry = value;
    const elementId = id;
    untrack(() => group.registerId(entry, elementId));
    return () => untrack(() => group.registerId(entry, null));
});

const toggle = () => {
    if (disabled) {
        return;
    }
    const next = indeterminate ? true : !checked;
    if (!inGroup || group === undefined) {
        if (own.set(next)) {
            onCheckedChange?.(next, { reason: "none" });
        }
    } else if (parent) {
        group.setAll(next);
    } else {
        group.toggle(value as string, next);
    }
};

$effect(() => {
    const element = input;
    if (element === null) {
        return undefined;
    }
    return bridgeForm(element, {
        reset: () => {
            if (inGroup && group !== undefined) {
                group.reset();
            } else {
                const initial = untrack(() => defaultChecked);
                if (own.set(initial)) {
                    onCheckedChange?.(initial, { reason: "none" });
                }
            }
            // the browser reset the input to its own default: write the state back (an
            // unchanged state does not re-run the binding)
            element.checked = inputChecked;
        },
        invalid: () => button,
    });
});

const checkboxState: CheckboxState = {
    get checked() {
        return checked;
    },
    get indeterminate() {
        return indeterminate;
    },
    get disabled() {
        return disabled;
    },
    get required() {
        return required;
    },
};
CheckboxContext.provide(checkboxState);

const controls = $derived(
    inGroup && parent && group !== undefined
        ? group.allValues
              .map((entry) => group.ids[entry])
              .filter((entry): entry is string => entry !== undefined)
              .join(" ") || undefined
        : undefined,
);
const partState = $derived({ checked, indeterminate, disabled, required });
const partProps = $derived(
    mergeProps(
        {
            type: "button",
            role: "checkbox",
            id,
            disabled,
            "aria-checked": indeterminate
                ? "mixed"
                : checked
                  ? "true"
                  : "false",
            "aria-required": required ? "true" : undefined,
            "aria-controls": controls,
            "data-checkbox-part": "root",
            ...stateAttributes({
                ...checkedAttributes(partState),
                required,
            }),
            onclick: toggle,
            onkeydown: (event: KeyboardEvent) => {
                // APG: Space toggles, Enter does not (a button would click on Enter)
                if (event.key === "Enter") {
                    event.preventDefault();
                }
            },
            ...ref,
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<button {...partProps}>{@render children?.()}</button>{/if}<input bind:this={input} type="checkbox" aria-hidden="true" tabindex={-1} name={parent ? undefined : name} value={value ?? "on"} checked={inputChecked} {required} {disabled} style={HIDDEN_INPUT_STYLE} data-checkbox-part="input" />
