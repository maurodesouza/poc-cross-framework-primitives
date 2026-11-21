<script lang="ts">
import type { FieldState } from "@poc/dom";
import { untrack } from "svelte";
import type { ChangeDetails } from "../../utils/change-details.ts";
import { Controllable } from "../../utils/controllable.svelte.ts";
import { elementRef } from "../../utils/element-ref.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { useFieldControl } from "../../utils/use-field-control.svelte.ts";
import { FieldContext } from "./field-context.svelte.ts";

const OUTSIDE_STATE: FieldState = {
    valid: null,
    dirty: false,
    touched: false,
    filled: false,
    focused: false,
    disabled: false,
};

/** The field's native input (`bind:value`, spec/field.md); every native attribute is forwarded. */
let {
    child,
    children: _children,
    value = $bindable(),
    defaultValue = "",
    onValueChange,
    id: idProp,
    name,
    disabled: disabledProp = false,
    ...rest
}: PartProps<FieldState> & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string, details: ChangeDetails) => void;
    id?: string;
    name?: string;
    disabled?: boolean;
} = $props();

const generatedId = $props.id();
const id = $derived(idProp ?? generatedId);
const own = new Controllable(
    () => value,
    (next) => (value = next),
    untrack(() => defaultValue),
);
let input = $state<HTMLInputElement | null>(null);
const ref = elementRef((element) => {
    input = element as HTMLInputElement | null;
});
const field = useFieldControl({
    id: () => id,
    labelable: true,
    value: () => own.value,
    filled: () => own.value !== "",
    input: () => input,
});
const context = FieldContext.maybe();
const disabled = $derived(disabledProp || field.disabled);

const partState = $derived(context?.state ?? OUTSIDE_STATE);
const partProps = $derived(
    mergeProps(
        {
            id,
            name: field.name ?? name,
            disabled,
            value: own.value,
            oninput: (event: Event) => {
                const element = event.currentTarget as HTMLInputElement;
                if (own.set(element.value)) {
                    onValueChange?.(element.value, { reason: "none" });
                }
                // a bound value the consumer kept changes no state: re-assert it
                if (element.value !== own.value) {
                    element.value = own.value;
                }
            },
            onfocus: field.onfocus,
            onblur: field.onblur,
            ...field.aria,
            "data-field-part": "control",
            ...field.attributes,
            // outside a field, only its own disabled state
            ...(field.inField ? {} : stateAttributes({ disabled })),
            ...ref,
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<input {...partProps} />{/if}
