import type { ComputedRef, InjectionKey, Ref, ShallowRef } from "vue";
import type { ChangeReason } from "../../utils/change-details.ts";

export interface SliderContext {
    values: ComputedRef<readonly number[]>;
    min: () => number;
    max: () => number;
    step: () => number;
    largeStep: () => number;
    minStepsBetweenValues: () => number;
    orientation: () => "horizontal" | "vertical";
    disabled: () => boolean;
    dragging: Ref<boolean>;
    /** The thumb a pointer drags (or last pressed), else -1. */
    activeIndex: Ref<number>;
    /** Moves thumb `index` to `value` (snapped, within its bounds), reports it, returns the values. */
    setThumb: (
        index: number,
        value: number,
        reason: ChangeReason,
    ) => readonly number[];
    /** Reports the values (default: the current ones) as committed. */
    commit: (values?: readonly number[]) => void;
    /** The thumbs in document order, for the default `index` and focusing the moved one. */
    thumbs: ShallowRef<readonly HTMLElement[]>;
    registerThumb: (element: HTMLElement) => () => void;
}

export const SliderKey: InjectionKey<SliderContext> = Symbol("Slider");

/** The state every slider part shares. */
export interface SliderState {
    orientation: "horizontal" | "vertical";
    disabled: boolean;
    dragging: boolean;
}

export function sliderState(context: SliderContext): SliderState {
    return {
        orientation: context.orientation(),
        disabled: context.disabled(),
        dragging: context.dragging.value,
    };
}
