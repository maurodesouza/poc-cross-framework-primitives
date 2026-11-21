import {
    fractionAlong,
    getDirection,
    nearestThumb,
    startDrag,
    valueAtFraction,
} from "@poc/dom";
import { defineComponent, onBeforeUnmount } from "vue";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { SliderKey, sliderState } from "./slider-context.ts";

/**
 * The interactive area: a press moves the nearest thumb there, then drags it with pointer capture
 * (spec/slider.md, "Pointer").
 */
export const SliderControl = defineComponent({
    name: "SliderControl",
    inheritAttrs: false,
    props: asProp,
    setup(props, { attrs, slots }) {
        const context = useRequiredContext(SliderKey, "Slider.Control");
        let endDrag: (() => void) | null = null;
        onBeforeUnmount(() => endDrag?.());

        const valueAt = (element: HTMLElement, x: number, y: number) => {
            const fraction = fractionAlong(
                element.getBoundingClientRect(),
                { x, y },
                context.orientation(),
                getDirection(element) === "rtl",
            );
            return valueAtFraction(fraction, {
                min: context.min(),
                max: context.max(),
                step: context.step(),
            });
        };

        const onPointerdown = (event: PointerEvent) => {
            if (
                context.disabled() ||
                (event.pointerType === "mouse" && event.button !== 0)
            ) {
                return;
            }
            event.preventDefault();
            const element = event.currentTarget as HTMLElement;
            const value = valueAt(element, event.clientX, event.clientY);
            const index = nearestThumb(context.values.value, value);
            context.setThumb(index, value, "track-press");
            context.thumbs.value[index]?.focus();
            context.activeIndex.value = index;
            context.dragging.value = true;
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
                    context.dragging.value = false;
                    context.commit();
                },
            });
        };

        return () => {
            const state = sliderState(context);
            return renderPart("div", { attrs, slots }, props.as, state, {
                "data-slider-part": "control",
                ...stateAttributes({
                    orientation: state.orientation,
                    disabled: state.disabled,
                    dragging: state.dragging,
                }),
                // structural: a touch drag must not scroll the page
                style: { touchAction: "none" },
                onPointerdown,
            });
        };
    },
});
