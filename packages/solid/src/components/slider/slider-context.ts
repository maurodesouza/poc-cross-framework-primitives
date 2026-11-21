import { createContext } from "solid-js";
import type { FieldControlBinding } from "../../hooks/create-field-control.ts";
import type { ChangeReason } from "../../utils/change-details.ts";

export interface SliderContextValue {
    /** The enclosing field's binding, for the thumbs (spec/field.md). */
    field: FieldControlBinding;
    values: () => readonly number[];
    min: () => number;
    max: () => number;
    step: () => number;
    largeStep: () => number;
    minStepsBetweenValues: () => number;
    orientation: () => "horizontal" | "vertical";
    disabled: () => boolean;
    dragging: () => boolean;
    /** The thumb a pointer drags (or last pressed), else -1. */
    activeIndex: () => number;
    /** Moves thumb `index` to `value` (snapped, within its bounds), reports it, returns the values. */
    setThumb: (
        index: number,
        value: number,
        reason: ChangeReason,
    ) => readonly number[];
    /** Reports the values (default: the current ones) as committed. */
    commit: (values?: readonly number[]) => void;
    /**
     * A thumb's default `index`: the lowest one no mounted thumb holds, so thumbs created in
     * document order take 0, 1, ... and a thumb that remounts takes its index back.
     */
    nextThumb: () => number;
    /** A thumb unmounted: its default index is free again. */
    releaseThumb: (index: number) => void;
    /** Each thumb's element by its index, for focusing the moved one (not reactive). */
    thumbElements: (HTMLElement | undefined)[];
    startDragging: (index: number) => void;
    stopDragging: () => void;
}

export const SliderContext = createContext<SliderContextValue>();

/** The state every slider part shares. */
export interface SliderState {
    orientation: "horizontal" | "vertical";
    disabled: boolean;
    dragging: boolean;
}

export function sliderState(context: SliderContextValue): SliderState {
    return {
        orientation: context.orientation(),
        disabled: context.disabled(),
        dragging: context.dragging(),
    };
}
