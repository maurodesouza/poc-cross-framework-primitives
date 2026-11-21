<script lang="ts">
import { elementRef } from "../../utils/element-ref.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { TooltipContext } from "./tooltip-context.svelte.ts";

/** The `tooltip`; never takes focus (spec/tooltip.md). */
let {
    child,
    children,
    ...rest
}: PartProps<{ open: boolean; side: string; align: string; instant: boolean }> =
    $props();
const context = TooltipContext.use("Tooltip.Popup");
const ref = elementRef((element) => (context.popup = element));
const partState = $derived({
    open: context.open,
    instant: context.instant,
    ...context.placed,
});
const partProps = $derived(
    mergeProps(
        {
            id: context.popupId,
            role: "tooltip",
            "data-tooltip-part": "popup",
            ...stateAttributes({
                open: context.open,
                side: context.placed.side,
                align: context.placed.align,
                instant: context.instant,
                "starting-style": context.presence.status === "starting",
                "ending-style": context.presence.status === "ending",
            }),
            ...ref,
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<div {...partProps}>{@render children?.()}</div>{/if}
