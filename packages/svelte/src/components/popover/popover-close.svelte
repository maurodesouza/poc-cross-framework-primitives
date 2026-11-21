<script lang="ts">
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { PopoverContext } from "./popover-context.svelte.ts";

let { child, children, ...rest }: PartProps<Record<string, never>> = $props();
const context = PopoverContext.use("Popover.Close");
const partProps = $derived(
    mergeProps(
        {
            type: "button",
            "data-popover-part": "close",
            onclick: () => context.setOpen(false, "close-press"),
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: {} })}{:else}<button {...partProps}>{@render children?.()}</button>{/if}
