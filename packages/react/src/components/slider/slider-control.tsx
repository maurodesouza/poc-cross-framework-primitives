import {
    fractionAlong,
    getDirection,
    nearestThumb,
    startDrag,
    valueAtFraction,
} from "@poc/dom";
import { type PointerEvent, useEffect, useRef } from "react";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
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
    const context = useRequiredContext(SliderContext, "Slider.Control");
    const endDrag = useRef<(() => void) | null>(null);
    useEffect(() => () => endDrag.current?.(), []);
    const latest = useRef(context);
    latest.current = context;

    const valueAt = (element: HTMLElement, x: number, y: number) => {
        const { min, max, step, orientation } = latest.current;
        const fraction = fractionAlong(
            element.getBoundingClientRect(),
            { x, y },
            orientation,
            getDirection(element) === "rtl",
        );
        return valueAtFraction(fraction, { min, max, step });
    };

    const onPointerDown = (event: PointerEvent<HTMLElement>) => {
        if (
            context.disabled ||
            (event.pointerType === "mouse" && event.button !== 0)
        ) {
            return;
        }
        event.preventDefault();
        const element = event.currentTarget;
        const value = valueAt(element, event.clientX, event.clientY);
        const index = nearestThumb(context.values, value);
        context.setThumb(index, value, "track-press");
        context.thumbs[index]?.focus();
        context.startDragging(index);
        endDrag.current?.();
        endDrag.current = startDrag(element, event.nativeEvent, {
            onMove: (move) =>
                latest.current.setThumb(
                    index,
                    valueAt(element, move.clientX, move.clientY),
                    "drag",
                ),
            onEnd: () => {
                endDrag.current = null;
                latest.current.stopDragging();
                latest.current.commit();
            },
        });
    };

    const state = sliderState(context);
    return renderElement(
        "div",
        props,
        state,
        {
            "data-slider-part": "control",
            ...stateAttributes({
                orientation: state.orientation,
                disabled: state.disabled,
                dragging: state.dragging,
            }),
            // structural: a touch drag must not scroll the page
            style: { touchAction: "none" },
            onPointerDown,
        },
        context.setControl,
    );
}
