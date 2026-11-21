import {
    getDirection,
    sliderKeyTarget,
    thumbBounds,
    valueToPercent,
} from "@poc/dom";
import { type KeyboardEvent, useLayoutEffect, useRef } from "react";
import { useElement } from "../../hooks/use-element.ts";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
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
    /** Its value's index (default: its order among the thumbs). */
    index?: number;
    /** The text for `aria-valuetext`. */
    getAriaValueText?: (value: number, index: number) => string;
    disabled?: boolean;
}

/** A `slider`: one value of the slider (spec/slider.md). */
export function SliderThumb({
    index: indexProp,
    getAriaValueText,
    disabled: disabledProp = false,
    ...props
}: SliderThumbProps) {
    const context = useRequiredContext(SliderContext, "Slider.Thumb");
    const [element, ref] = useElement<HTMLElement>();
    const previous = useRef<HTMLElement | null>(null);
    const { registerThumb } = context;
    useLayoutEffect(() => {
        registerThumb(element, previous.current);
        previous.current = element;
        return () => {
            if (element !== null) {
                registerThumb(null, element);
            }
        };
    }, [element, registerThumb]);

    const order = element === null ? -1 : context.thumbs.indexOf(element);
    const index = indexProp ?? Math.max(order, 0);
    const value = context.values[index] ?? context.min;
    const disabled = disabledProp || context.disabled;
    const bounds = thumbBounds(context.values, index, context);
    const dragging = context.dragging && context.activeIndex === index;
    const vertical = context.orientation === "vertical";
    const rtl = element !== null && getDirection(element) === "rtl";
    const percent = valueToPercent(value, context.min, context.max);
    // structural: the thumb's centre on its value
    const style = vertical
        ? {
              position: "absolute" as const,
              insetBlockEnd: `${percent}%`,
              left: "50%",
              translate: "-50% 50%",
          }
        : {
              position: "absolute" as const,
              insetInlineStart: `${percent}%`,
              top: "50%",
              translate: rtl ? "50% -50%" : "-50% -50%",
          };

    const onKeyDown = (event: KeyboardEvent) => {
        if (disabled) {
            return;
        }
        const target = sliderKeyTarget(event.key, event.shiftKey, value, {
            step: context.step,
            largeStep: context.largeStep,
            min: bounds.min,
            max: bounds.max,
            orientation: context.orientation,
            rtl,
        });
        if (target === null) {
            return;
        }
        event.preventDefault();
        context.commit(context.setThumb(index, target, "keyboard"));
    };

    const { field } = context;
    // the field's label names a thumb that has no name of its own
    const named =
        props["aria-label"] !== undefined ||
        props["aria-labelledby"] !== undefined;
    const state = {
        value,
        index,
        orientation: context.orientation,
        disabled,
        dragging,
    };
    return renderElement(
        "div",
        props,
        state,
        {
            role: "slider",
            tabIndex: disabled ? undefined : 0,
            "aria-valuenow": value,
            "aria-valuemin": bounds.min,
            "aria-valuemax": bounds.max,
            "aria-valuetext": getAriaValueText?.(value, index),
            "aria-orientation": context.orientation,
            "aria-disabled": disabled ? "true" : undefined,
            ...field.aria,
            "aria-labelledby": named
                ? undefined
                : field.aria["aria-labelledby"],
            "data-slider-part": "thumb",
            ...stateAttributes({
                orientation: context.orientation,
                index: String(index),
                disabled,
                dragging,
            }),
            style,
            onKeyDown,
            onFocus: field.onFocus,
            onBlur: field.onBlur,
        },
        ref,
    );
}
