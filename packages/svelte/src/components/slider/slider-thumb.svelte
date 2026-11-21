<script lang="ts">
import {
    getDirection,
    sliderKeyTarget,
    thumbBounds,
    valueToPercent,
} from "@poc/dom";
import { elementRef } from "../../utils/element-ref.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { SliderContext } from "./slider-context.svelte.ts";

/** A `slider`: one value of the slider (spec/slider.md). */
let {
    child,
    children,
    index: indexProp,
    getAriaValueText,
    disabled: disabledProp = false,
    ...rest
}: PartProps<{
    value: number;
    index: number;
    orientation: "horizontal" | "vertical";
    disabled: boolean;
    dragging: boolean;
}> & {
    /** Its value's index (default: its order among the thumbs). */
    index?: number;
    /** The text for `aria-valuetext`. */
    getAriaValueText?: (value: number, index: number) => string;
    disabled?: boolean;
} = $props();
const context = SliderContext.use("Slider.Thumb");
let element = $state<HTMLElement | null>(null);
const ref = elementRef((node) => (element = node));
$effect(() => {
    const node = element;
    if (node === null) {
        return undefined;
    }
    context.registerThumb(node, null);
    return () => context.registerThumb(null, node);
});

const index = $derived(
    indexProp ??
        Math.max(element === null ? -1 : context.thumbs.indexOf(element), 0),
);
const value = $derived(context.values[index] ?? context.min);
const disabled = $derived(disabledProp || context.disabled);
const bounds = $derived(thumbBounds(context.values, index, context.options()));
const dragging = $derived(context.dragging && context.activeIndex === index);
const rtl = $derived(element !== null && getDirection(element) === "rtl");
const style = $derived.by(() => {
    const percent = valueToPercent(value, context.min, context.max);
    // structural: the thumb's centre on its value
    return context.orientation === "vertical"
        ? `position: absolute; inset-block-end: ${percent}%; left: 50%; translate: -50% 50%`
        : `position: absolute; inset-inline-start: ${percent}%; top: 50%; translate: ${rtl ? "50% -50%" : "-50% -50%"}`;
});

const onkeydown = (event: KeyboardEvent) => {
    if (disabled) {
        return;
    }
    const options = context.options();
    const target = sliderKeyTarget(event.key, event.shiftKey, value, {
        step: options.step,
        largeStep: options.largeStep,
        min: bounds.min,
        max: bounds.max,
        orientation: options.orientation,
        rtl,
    });
    if (target === null) {
        return;
    }
    event.preventDefault();
    context.commit(context.setThumb(index, target, "keyboard"));
};

const partState = $derived({
    value,
    index,
    orientation: context.orientation,
    disabled,
    dragging,
});
const partProps = $derived(
    mergeProps(
        {
            role: "slider",
            tabindex: disabled ? undefined : 0,
            "aria-valuenow": value,
            "aria-valuemin": bounds.min,
            "aria-valuemax": bounds.max,
            "aria-valuetext": getAriaValueText?.(value, index),
            "aria-orientation": context.orientation,
            "aria-disabled": disabled ? "true" : undefined,
            "data-slider-part": "thumb",
            ...stateAttributes({
                orientation: context.orientation,
                index: String(index),
                disabled,
                dragging,
            }),
            style,
            onkeydown,
            ...ref,
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<div {...partProps}>{@render children?.()}</div>{/if}
