<script lang="ts">
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { ComboboxItemContext } from "./combobox-context.svelte.ts";

/** Marks a selected item; hidden from assistive technologies (spec/combobox.md). */
let {
    child,
    children,
    keepMounted = false,
    ...rest
}: PartProps<{ selected: boolean }> & {
    /** Rendered while the item is not selected too. */
    keepMounted?: boolean;
} = $props();
const item = ComboboxItemContext.use("Combobox.ItemIndicator");
const partState = $derived({ selected: item.selected });
const partProps = $derived(
    mergeProps(
        { "aria-hidden": "true", "data-combobox-part": "item-indicator" },
        rest,
    ),
);
</script>

{#if item.selected || keepMounted}{#if child}{@render child({ props: partProps, state: partState })}{:else}<span {...partProps}>{@render children?.()}</span>{/if}{/if}
