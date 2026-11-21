<script lang="ts">
import {
    fractionAlong,
    getDirection,
    nearestThumb,
    startDrag,
    valueAtFraction,
} from "@poc/dom";
import { onDestroy } from "svelte";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { SliderContext, sliderState } from "./slider-context.svelte.ts";

/**
 * The interactive area: a press moves the nearest thumb there, then drags it with pointer capture
 * (spec/slider.md, "Pointer").
 */
let {
    child,
    children,
    ...rest
}: PartProps<{
    orientation: "horizontal" | "vertical";
    disabled: boolean;
    dragging: boolean;
}> = $props();
const context = SliderContext.use("Slider.Control");
let endDrag: (() => void) | null = null;
onDestroy(() => endDrag?.());

const valueAt = (element: HTMLElement, x: number, y: number) => {
    const { min, max, step, orientation } = context.options();
    const fraction = fractionAlong(
        element.getBoundingClientRect(),
        { x, y },
        orientation,
        getDirection(element) === "rtl",
    );
    return valueAtFraction(fraction, { min, max, step });
};

const onpointerdown = (event: PointerEvent) => {
    if (
        context.disabled ||
        (event.pointerType === "mouse" && event.button !== 0)
    ) {
        return;
    }
    event.preventDefault();
    const element = event.currentTarget as HTMLElement;
    const value = valueAt(element, event.clientX, event.clientY);
    const index = nearestThumb(context.values, value);
    context.setThumb(index, value, "track-press");
    context.thumbs[index]?.focus();
    context.startDragging(index);
    endDrag?.();
    endDrag = startDrag(element, event, {
        onMove: (move) =>
            context.setThumb(
                index,
                valueAt(element, move.clientX, move.clientY),
                "drag",
            ),
        onEnd: () => {
            endDrag = null;
            context.stopDragging();
            context.commit();
        },
    });
};

const partState = $derived(sliderState(context));
const partProps = $derived(
    mergeProps(
        {
            "data-slider-part": "control",
            ...stateAttributes(partState),
            // structural: a touch drag must not scroll the page
            style: "touch-action: none",
            onpointerdown,
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<div {...partProps}>{@render children?.()}</div>{/if}
