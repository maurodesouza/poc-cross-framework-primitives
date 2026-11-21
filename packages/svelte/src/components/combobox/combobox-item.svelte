<script lang="ts">
import { elementRef } from "../../utils/element-ref.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import {
    ComboboxContext,
    ComboboxItemContext,
} from "./combobox-context.svelte.ts";

/** An `option` (spec/combobox.md). */
let {
    child,
    children,
    value,
    disabled = false,
    ...rest
}: PartProps<{ highlighted: boolean; selected: boolean; disabled: boolean }> & {
    /** The item: written into the input as `itemToStringLabel(value)` when chosen. */
    value: unknown;
    /** Can be highlighted, never chosen. */
    disabled?: boolean;
} = $props();
const context = ComboboxContext.use("Combobox.Item");
const id = $props.id();
let element = $state<HTMLElement | null>(null);
const ref = elementRef((node) => (element = node));
$effect(() => {
    const node = element;
    if (node === null) {
        return undefined;
    }
    return context.register(node, { value, disabled, id });
});
const highlighted = $derived(context.highlighted === id);
const selected = $derived(context.isSelected(value));
$effect(() => {
    if (highlighted) {
        element?.scrollIntoView?.({ block: "nearest" });
    }
});
ComboboxItemContext.provide({
    get selected() {
        return selected;
    },
});
const partState = $derived({ highlighted, selected, disabled });
const partProps = $derived(
    mergeProps(
        {
            role: "option",
            id,
            "aria-selected": selected ? "true" : undefined,
            "aria-disabled": disabled ? "true" : undefined,
            "data-combobox-part": "item",
            ...stateAttributes({ highlighted, selected, disabled }),
            onpointermove: () => {
                if (!highlighted) {
                    context.highlighted = id;
                }
            },
            onpointerdown: (event: PointerEvent) => event.preventDefault(),
            onclick: () => {
                if (!disabled) {
                    context.choose(value);
                }
            },
            ...ref,
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<div {...partProps}>{@render children?.()}</div>{/if}
