<script lang="ts">
import { elementRef } from "../../utils/element-ref.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { TooltipContext } from "./tooltip-context.svelte.ts";

/** Points at the anchor; placed along the popup's edge by the positioner. */
let { child, children, ...rest }: PartProps<{ side: string; align: string }> =
    $props();
const context = TooltipContext.use("Tooltip.Arrow");
const ref = elementRef((element) => (context.arrow = element));
const partState = $derived(context.placed);
const partProps = $derived(
    mergeProps(
        {
            "aria-hidden": "true",
            "data-tooltip-part": "arrow",
            ...stateAttributes({
                side: context.placed.side,
                align: context.placed.align,
            }),
            ...ref,
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<div {...partProps}>{@render children?.()}</div>{/if}
