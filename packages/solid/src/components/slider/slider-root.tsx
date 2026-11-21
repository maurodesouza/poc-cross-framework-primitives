import { moveThumb } from "@poc/dom";
import { createSignal, For, untrack } from "solid-js";
import { createControllable } from "../../hooks/create-controllable.ts";
import type {
    ChangeDetails,
    ChangeReason,
} from "../../utils/change-details.ts";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import {
    SliderContext,
    type SliderContextValue,
    type SliderState,
    sliderState,
} from "./slider-context.ts";

type SliderValue = number | readonly number[];

export interface SliderRootProps extends PartProps<SliderState> {
    /** A number, or an array of numbers for several thumbs. */
    value?: SliderValue;
    defaultValue?: SliderValue;
    onValueChange?: (value: number & number[], details: ChangeDetails) => void;
    /** When a drag ends, or after a key changed the value. */
    onValueCommit?: (value: number & number[], details: ChangeDetails) => void;
    min?: number;
    max?: number;
    step?: number;
    largeStep?: number;
    minStepsBetweenValues?: number;
    orientation?: "horizontal" | "vertical";
    disabled?: boolean;
    name?: string;
}

const OWN_PROPS = [
    "value",
    "defaultValue",
    "onValueChange",
    "onValueCommit",
    "min",
    "max",
    "step",
    "largeStep",
    "minStepsBetweenValues",
    "orientation",
    "disabled",
    "name",
] as const;

function toArray(value: SliderValue): readonly number[] {
    return typeof value === "number" ? [value] : value;
}

function sameValues(a: readonly number[], b: readonly number[]): boolean {
    return (
        a.length === b.length && a.every((entry, index) => entry === b[index])
    );
}

/** Holds the slider's values; renders the `group` and one hidden input per value (spec/slider.md). */
export function SliderRoot(props: SliderRootProps) {
    // the value's shape (a number or an array) is the API's, fixed at creation
    const range = untrack(() =>
        Array.isArray(props.value ?? props.defaultValue),
    );
    const output = (values: readonly number[]) =>
        (range ? [...values] : values[0]) as number & number[];
    const min = () => props.min ?? 0;
    const max = () => props.max ?? 100;
    const step = () => props.step ?? 1;
    const minStepsBetweenValues = () => props.minStepsBetweenValues ?? 0;
    const [current, setCurrent] = createControllable<
        readonly number[],
        ChangeDetails
    >(
        () => (props.value === undefined ? undefined : toArray(props.value)),
        () => toArray(props.defaultValue ?? min()),
        (next, details) => props.onValueChange?.(output(next), details),
    );
    // thumbs are created in document order (each takes the lowest free index when it has none)
    const taken: boolean[] = [];
    const [dragging, setDragging] = createSignal(false);
    const [activeIndex, setActiveIndex] = createSignal(-1);

    const context: SliderContextValue = {
        values: current,
        min,
        max,
        step,
        largeStep: () => props.largeStep ?? 10,
        minStepsBetweenValues,
        orientation: () => props.orientation ?? "horizontal",
        disabled: () => props.disabled ?? false,
        dragging,
        activeIndex,
        setThumb: (index: number, next: number, reason: ChangeReason) => {
            const before = current();
            const values = moveThumb(before, index, next, {
                min: min(),
                max: max(),
                step: step(),
                minStepsBetweenValues: minStepsBetweenValues(),
            });
            if (!sameValues(values, before)) {
                setCurrent(values, { reason });
            }
            return values;
        },
        commit: (values?: readonly number[]) =>
            props.onValueCommit?.(output(values ?? current()), {
                reason: "none",
            }),
        nextThumb: () => {
            let index = taken.indexOf(false);
            if (index === -1) {
                index = taken.length;
            }
            taken[index] = true;
            return index;
        },
        releaseThumb: (index) => {
            taken[index] = false;
        },
        thumbElements: [],
        startDragging: (index) => {
            setActiveIndex(index);
            setDragging(true);
        },
        stopDragging: () => setDragging(false),
    };
    const state = () => sliderState(context);
    return (
        <SliderContext value={context}>
            {renderPart(
                "div",
                props,
                state,
                () => ({
                    role: "group",
                    "data-slider-part": "root",
                    ...stateAttributes({ ...state() }),
                }),
                {
                    omit: OWN_PROPS,
                    children: () => (
                        <>
                            {props.children}
                            <For each={current()} keyed={false}>
                                {(entry) => (
                                    // one per value, in order
                                    <input
                                        type="hidden"
                                        name={props.name}
                                        value={entry()}
                                        data-slider-part="input"
                                    />
                                )}
                            </For>
                        </>
                    ),
                },
            )}
        </SliderContext>
    );
}
