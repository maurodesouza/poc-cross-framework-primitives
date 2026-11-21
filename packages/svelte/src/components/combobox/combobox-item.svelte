<script lang="ts">
import { elementRef } from "../../utils/element-ref.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { ComboboxContext } from "./combobox-context.svelte.ts";

let {
    child,
    children,
    value,
    label,
    disabled = false,
    ...rest
}: PartProps<{ highlighted: boolean; selected: boolean; disabled: boolean }> & {
    value: string;
    label?: string;
    disabled?: boolean;
} = $props();
const context = ComboboxContext.use("Combobox.Item");
const id = `${context.listId}-option-${Math.random().toString(36).slice(2, 8)}`;
let element = $state<HTMLElement | null>(null);
const ref = elementRef((node) => (element = node));
$effect(() => {
    const node = element;
    if (node === null) {
        return undefined;
    }
    context.items.set(node, {
        value,
        label: label ?? node.textContent ?? "",
        disabled,
        id,
    });
    context.itemCount = context.items.size;
    return () => {
        context.items.delete(node);
        context.itemCount = context.items.size;
    };
});
const highlighted = $derived(context.highlighted === value);
const selected = $derived(context.value === value);
$effect(() => {
    if (highlighted) {
        element?.scrollIntoView?.({ block: "nearest" });
    }
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
                    context.highlighted = value;
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
