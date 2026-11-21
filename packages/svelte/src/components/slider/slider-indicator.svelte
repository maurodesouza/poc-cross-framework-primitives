<script lang="ts">
import { valueToPercent } from "@poc/dom";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { SliderContext, sliderState } from "./slider-context.svelte.ts";

/** The filled part: from `min` to the value, or between the thumbs (spec/slider.md). */
let {
    child,
    children,
    ...rest
}: PartProps<{
    orientation: "horizontal" | "vertical";
    disabled: boolean;
    dragging: boolean;
}> = $props();
const context = SliderContext.use("Slider.Indicator");
const style = $derived.by(() => {
    const percents = context.values.map((entry) =>
        valueToPercent(entry, context.min, context.max),
    );
    const start = percents.length > 1 ? (percents[0] ?? 0) : 0;
    const end = percents.at(-1) ?? 0;
    return context.orientation === "vertical"
        ? `position: absolute; inset-block-end: ${start}%; block-size: ${end - start}%`
        : `position: absolute; inset-inline-start: ${start}%; inline-size: ${end - start}%`;
});
const partState = $derived(sliderState(context));
const partProps = $derived(
    mergeProps(
        {
            "data-slider-part": "indicator",
            ...stateAttributes({ orientation: context.orientation }),
            style,
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<div {...partProps}>{@render children?.()}</div>{/if}
