import { moveThumb } from "@poc/dom";
import { useCallback, useMemo, useRef, useState } from "react";
import { useControllableState } from "../../hooks/use-controllable-state.ts";
import { useElement } from "../../hooks/use-element.ts";
import type {
    ChangeDetails,
    ChangeReason,
} from "../../utils/change-details.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import {
    SliderContext,
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

function toArray(value: SliderValue): readonly number[] {
    return typeof value === "number" ? [value] : value;
}

function sameValues(a: readonly number[], b: readonly number[]): boolean {
    return (
        a.length === b.length && a.every((entry, index) => entry === b[index])
    );
}

/** Holds the slider's values; renders the `group` and one hidden input per value (spec/slider.md). */
export function SliderRoot({
    value: valueProp,
    defaultValue,
    onValueChange,
    onValueCommit,
    min = 0,
    max = 100,
    step = 1,
    largeStep = 10,
    minStepsBetweenValues = 0,
    orientation = "horizontal",
    disabled = false,
    name,
    children,
    ...props
}: SliderRootProps) {
    const range = Array.isArray(valueProp ?? defaultValue);
    const output = (values: readonly number[]) =>
        (range ? [...values] : values[0]) as number & number[];
    const [current, setCurrent] = useControllableState<
        readonly number[],
        ChangeDetails
    >(
        valueProp === undefined ? undefined : toArray(valueProp),
        toArray(defaultValue ?? min),
        (next, details) => onValueChange?.(output(next), details),
    );
    const [root, rootRef] = useElement<HTMLElement>();
    const [control, setControl] = useState<HTMLElement | null>(null);
    const [thumbs, setThumbs] = useState<readonly HTMLElement[]>([]);
    const [dragging, setDragging] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const latest = useRef({ current, onValueCommit, output });
    latest.current = { current, onValueCommit, output };

    const setThumb = useCallback(
        (index: number, next: number, reason: ChangeReason) => {
            const before = latest.current.current;
            const values = moveThumb(before, index, next, {
                min,
                max,
                step,
                minStepsBetweenValues,
            });
            if (!sameValues(values, before)) {
                setCurrent(values, { reason });
            }
            return values;
        },
        [min, max, step, minStepsBetweenValues, setCurrent],
    );
    const commit = useCallback((values?: readonly number[]) => {
        const {
            current,
            onValueCommit: onCommit,
            output: shape,
        } = latest.current;
        onCommit?.(shape(values ?? current), { reason: "none" });
    }, []);
    const registerThumb = useCallback(
        (element: HTMLElement | null, previous: HTMLElement | null) => {
            setThumbs((list) => {
                const next = list.filter((entry) => entry !== previous);
                if (element !== null && !next.includes(element)) {
                    next.push(element);
                }
                // in document order
                return next.sort((a, b) =>
                    a.compareDocumentPosition(b) &
                    Node.DOCUMENT_POSITION_FOLLOWING
                        ? -1
                        : 1,
                );
            });
        },
        [],
    );
    const startDragging = useCallback((index: number) => {
        setActiveIndex(index);
        setDragging(true);
    }, []);
    const stopDragging = useCallback(() => setDragging(false), []);

    const context = useMemo(
        () => ({
            values: current,
            min,
            max,
            step,
            largeStep,
            minStepsBetweenValues,
            orientation,
            disabled,
            dragging,
            activeIndex,
            setThumb,
            commit,
            control,
            setControl,
            root,
            thumbs,
            registerThumb,
            startDragging,
            stopDragging,
        }),
        [
            current,
            min,
            max,
            step,
            largeStep,
            minStepsBetweenValues,
            orientation,
            disabled,
            dragging,
            activeIndex,
            setThumb,
            commit,
            control,
            root,
            thumbs,
            registerThumb,
            startDragging,
            stopDragging,
        ],
    );
    const state = sliderState(context);
    const inputs = current.map((entry, index) => (
        <input
            // one per value, in order
            // biome-ignore lint/suspicious/noArrayIndexKey: the index is the thumb's identity
            key={index}
            type="hidden"
            name={name}
            value={entry}
            data-slider-part="input"
        />
    ));
    return (
        <SliderContext.Provider value={context}>
            {renderElement(
                "div",
                {
                    ...props,
                    children: (
                        <>
                            {children}
                            {inputs}
                        </>
                    ),
                },
                state,
                {
                    role: "group",
                    "data-slider-part": "root",
                    ...stateAttributes({
                        orientation,
                        disabled,
                        dragging,
                    }),
                },
                rootRef,
            )}
        </SliderContext.Provider>
    );
}
