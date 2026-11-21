<script lang="ts">
import { elementRef } from "../../utils/element-ref.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { SelectContext, SelectItemContext } from "./select-context.svelte.ts";

/** An `option` (spec/select.md). */
let {
    child,
    children,
    value,
    disabled: disabledProp,
    ...rest
}: PartProps<{ highlighted: boolean; selected: boolean; disabled: boolean }> & {
    value: string;
    /** Can be highlighted, never chosen (default: the Root item's `disabled`). */
    disabled?: boolean;
} = $props();
const context = SelectContext.use("Select.Item");
let element = $state<HTMLElement | null>(null);
const ref = elementRef((node) => (element = node));
const disabled = $derived(
    disabledProp ??
        context.items.find((item) => item.value === value)?.disabled ??
        false,
);
const highlighted = $derived(context.highlighted === value);
const selected = $derived(context.value === value);
$effect(() => {
    if (highlighted) {
        element?.scrollIntoView?.({ block: "nearest" });
    }
});
SelectItemContext.provide({
    get selected() {
        return selected;
    },
    get highlighted() {
        return highlighted;
    },
    get disabled() {
        return disabled;
    },
});
const partState = $derived({ highlighted, selected, disabled });
const partProps = $derived(
    mergeProps(
        {
            role: "option",
            id: context.itemId(value),
            "aria-selected": selected ? "true" : "false",
            "aria-disabled": disabled ? "true" : undefined,
            "data-select-part": "item",
            ...stateAttributes({ highlighted, selected, disabled }),
            onpointermove: () => {
                if (!highlighted) {
                    context.highlighted = value;
                }
            },
            // the trigger keeps DOM focus
            onpointerdown: (event: PointerEvent) => event.preventDefault(),
            onclick: () => {
                if (!disabled) {
                    context.choose(value, "item-press");
                }
            },
            ...ref,
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<div {...partProps}>{@render children?.()}</div>{/if}
