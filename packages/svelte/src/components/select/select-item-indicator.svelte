<script lang="ts">
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { SelectItemContext } from "./select-context.svelte.ts";

/** Marks the selected item; hidden from assistive technologies (spec/select.md). */
let {
    child,
    children,
    keepMounted = false,
    ...rest
}: PartProps<{ selected: boolean }> & {
    /** Rendered while the item is not selected too. */
    keepMounted?: boolean;
} = $props();
const item = SelectItemContext.use("Select.ItemIndicator");
const partState = $derived({ selected: item.selected });
const partProps = $derived(
    mergeProps(
        { "aria-hidden": "true", "data-select-part": "item-indicator" },
        rest,
    ),
);
</script>

{#if item.selected || keepMounted}{#if child}{@render child({ props: partProps, state: partState })}{:else}<span {...partProps}>{@render children?.()}</span>{/if}{/if}
