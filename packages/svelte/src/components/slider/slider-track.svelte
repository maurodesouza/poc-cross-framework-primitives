<script lang="ts">
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { SliderContext, sliderState } from "./slider-context.svelte.ts";

/** The rail (spec/slider.md). */
let {
    child,
    children,
    ...rest
}: PartProps<{
    orientation: "horizontal" | "vertical";
    disabled: boolean;
    dragging: boolean;
}> = $props();
const context = SliderContext.use("Slider.Track");
const partState = $derived(sliderState(context));
const partProps = $derived(
    mergeProps(
        { "data-slider-part": "track", ...stateAttributes(partState) },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<div {...partProps}>{@render children?.()}</div>{/if}
