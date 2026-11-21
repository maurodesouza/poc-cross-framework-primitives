import {
    getDirection,
    sliderKeyTarget,
    thumbBounds,
    valueToPercent,
} from "@poc/dom";
import { createEffect, createSignal, useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { SliderContext } from "./slider-context.ts";

export interface SliderThumbState {
    value: number;
    index: number;
    orientation: "horizontal" | "vertical";
    disabled: boolean;
    dragging: boolean;
}

export interface SliderThumbProps extends PartProps<SliderThumbState> {
    /** Its value's index (default: the thumbs' creation order, which is their order). */
    index?: number;
    /** The text for `aria-valuetext`. */
    getAriaValueText?: (value: number, index: number) => string;
    disabled?: boolean;
}

/** A `slider`: one value of the slider (spec/slider.md). */
export function SliderThumb(props: SliderThumbProps) {
    const context = useContext(SliderContext);
    const order = context.nextThumb();
    const index = () => props.index ?? order;
    const [element, setElement] = createSignal<HTMLElement | null>(null);
    createEffect(
        () => ({ node: element(), at: index() }),
        ({ node, at }) => {
            if (node === null) {
                return undefined;
            }
            context.thumbElements[at] = node;
            return () => {
                if (context.thumbElements[at] === node) {
                    context.thumbElements[at] = undefined;
                }
            };
        },
    );
    // the direction is read from the element once it exists: the render never reads the
    // element itself, which its own ref writes
    const [rtl, setRtl] = createSignal(false);
    createEffect(element, (node) => {
        if (node !== null) {
            setRtl(getDirection(node) === "rtl");
        }
    });
    const value = () => context.values()[index()] ?? context.min();
    const disabled = () => (props.disabled ?? false) || context.disabled();
    const bounds = () =>
        thumbBounds(context.values(), index(), {
            min: context.min(),
            max: context.max(),
            step: context.step(),
            minStepsBetweenValues: context.minStepsBetweenValues(),
        });
    const onKeyDown = (event: KeyboardEvent) => {
        if (disabled()) {
            return;
        }
        const { min, max } = bounds();
        const target = sliderKeyTarget(event.key, event.shiftKey, value(), {
            step: context.step(),
            largeStep: context.largeStep(),
            min,
            max,
            orientation: context.orientation(),
            rtl: rtl(),
        });
        if (target === null) {
            return;
        }
        event.preventDefault();
        context.commit(context.setThumb(index(), target, "keyboard"));
    };

    const state = () => ({
        value: value(),
        index: index(),
        orientation: context.orientation(),
        disabled: disabled(),
        dragging: context.dragging() && context.activeIndex() === index(),
    });
    return renderPart(
        "div",
        props,
        state,
        () => {
            const current = state();
            const { min, max } = bounds();
            const percent = valueToPercent(
                current.value,
                context.min(),
                context.max(),
            );
            return {
                role: "slider",
                tabindex: current.disabled ? undefined : 0,
                "aria-valuenow": String(current.value),
                "aria-valuemin": String(min),
                "aria-valuemax": String(max),
                "aria-valuetext": props.getAriaValueText?.(
                    current.value,
                    current.index,
                ),
                "aria-orientation": current.orientation,
                "aria-disabled": current.disabled ? "true" : undefined,
                "data-slider-part": "thumb",
                ...stateAttributes({
                    orientation: current.orientation,
                    index: String(current.index),
                    disabled: current.disabled,
                    dragging: current.dragging,
                }),
                // structural: the thumb's centre on its value
                style:
                    current.orientation === "vertical"
                        ? {
                              position: "absolute",
                              "inset-block-end": `${percent}%`,
                              left: "50%",
                              translate: "-50% 50%",
                          }
                        : {
                              position: "absolute",
                              "inset-inline-start": `${percent}%`,
                              top: "50%",
                              translate: rtl() ? "50% -50%" : "-50% -50%",
                          },
                onKeyDown,
            };
        },
        {
            ref: (node) => setElement(node),
            omit: ["index", "getAriaValueText", "disabled"],
        },
    );
}
