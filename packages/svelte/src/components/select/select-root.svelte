<script lang="ts">
import { bridgeForm } from "@poc/dom";
import { type Snippet, untrack } from "svelte";
import type { ChangeDetails } from "../../utils/change-details.ts";
import { HIDDEN_INPUT_STYLE } from "../../utils/hidden-input-style.ts";
import { useFieldControl } from "../../utils/use-field-control.svelte.ts";
import {
    SelectContext,
    type SelectItemData,
    SelectState,
} from "./select-context.svelte.ts";

/** Holds the select's state (`bind:value`, `bind:open`); renders its hidden form input (spec/select.md). */
let {
    value = $bindable(),
    defaultValue = null,
    onValueChange,
    open = $bindable(),
    defaultOpen = false,
    onOpenChange,
    items,
    name,
    required = false,
    disabled: disabledProp = false,
    children,
}: {
    value?: string | null;
    defaultValue?: string | null;
    onValueChange?: (value: string | null, details: ChangeDetails) => void;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean, details: ChangeDetails) => void;
    /** Every item: the Root needs their labels while the list is closed. */
    items: readonly SelectItemData[];
    name?: string;
    required?: boolean;
    disabled?: boolean;
    children?: Snippet;
} = $props();

let input = $state<HTMLInputElement | null>(null);
// its options are read once the select below exists (in effects and handlers)
const field = useFieldControl({
    // the trigger's rendered id: the consumer's, else the generated one
    id: () => select.trigger?.id || select.triggerId,
    labelable: true,
    value: () => select.value,
    filled: () => select.value !== null,
    input: () => input,
});
const disabled = $derived(disabledProp || field.disabled);

const select = new SelectState(
    {
        read: () => open,
        write: (next) => (open = next),
        initial: untrack(() => defaultOpen),
        onOpenChange: () => onOpenChange,
    },
    {
        read: () => value,
        write: (next) => (value = next),
        initial: untrack(() => defaultValue),
        onChange: () => onValueChange,
    },
    {
        items: () => items,
        disabled: () => disabled,
        required: () => required,
        field,
    },
);
SelectContext.provide(select);

$effect(() => {
    const element = input;
    if (element === null) {
        return undefined;
    }
    return bridgeForm(element, {
        reset: () => {
            select.setValue(
                untrack(() => defaultValue),
                "none",
            );
            // the browser reset the input to its own default: write the value back (an unchanged
            // value does not re-run the binding)
            element.value = select.value ?? "";
        },
        invalid: () => select.trigger,
    });
});
</script>

{@render children?.()}<input bind:this={input} aria-hidden="true" tabindex={-1} name={field.name ?? name} value={select.value ?? ""} {required} {disabled} style={HIDDEN_INPUT_STYLE} data-select-part="input" />
