import {
    fractionAlong,
    getDirection,
    nearestThumb,
    startDrag,
    valueAtFraction,
} from "@poc/dom";
import { flush, onCleanup, useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import {
    SliderContext,
    type SliderState,
    sliderState,
} from "./slider-context.ts";

/**
 * The interactive area: a press moves the nearest thumb there, then drags it with pointer capture
 * (spec/slider.md, "Pointer").
 */
export function SliderControl(props: PartProps<SliderState>) {
    const context = useContext(SliderContext);
    let endDrag: (() => void) | null = null;
    onCleanup(() => endDrag?.());

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

    const onPointerDown = (event: PointerEvent) => {
        if (
            context.disabled() ||
            (event.pointerType === "mouse" && event.button !== 0)
        ) {
            return;
        }
        event.preventDefault();
        const element = event.currentTarget as HTMLElement;
        const value = valueAt(element, event.clientX, event.clientY);
        const index = nearestThumb(context.values(), value);
        context.setThumb(index, value, "track-press");
        context.thumbElements[index]?.focus();
        context.startDragging(index);
        // the next move reads the values this press wrote
        flush();
        endDrag?.();
        endDrag = startDrag(element, event, {
            onMove: (move) => {
                context.setThumb(
                    index,
                    valueAt(element, move.clientX, move.clientY),
                    "drag",
                );
                flush();
            },
            onEnd: () => {
                endDrag = null;
                context.stopDragging();
                context.commit();
            },
        });
    };

    const state = () => sliderState(context);
    return renderPart("div", props, state, () => ({
        "data-slider-part": "control",
        ...stateAttributes({ ...state() }),
        // structural: a touch drag must not scroll the page
        style: { "touch-action": "none" },
        onPointerDown,
    }));
}
