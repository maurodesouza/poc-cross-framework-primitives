import { moveThumb } from "@poc/dom";
import { untrack } from "svelte";
import type {
    ChangeDetails,
    ChangeReason,
} from "../../utils/change-details.ts";
import { createContext } from "../../utils/context.ts";
import { Controllable } from "../../utils/controllable.svelte.ts";
import type { FieldControlBinding } from "../../utils/use-field-control.svelte.ts";

export type SliderValue = number | readonly number[];

export interface SliderOptions {
    min: number;
    max: number;
    step: number;
    largeStep: number;
    minStepsBetweenValues: number;
    orientation: "horizontal" | "vertical";
    disabled: boolean;
}

function toArray(value: SliderValue): readonly number[] {
    return typeof value === "number" ? [value] : value;
}

function sameValues(a: readonly number[], b: readonly number[]): boolean {
    return (
        a.length === b.length && a.every((entry, index) => entry === b[index])
    );
}

/** The slider's values and what its parts share (spec/slider.md). */
export class SliderState {
    dragging = $state(false);
    /** The thumb a pointer drags (or last pressed), else -1. */
    activeIndex = $state(-1);
    /** The thumbs, in document order: the default `index`, and focusing the moved one. */
    thumbs = $state<readonly HTMLElement[]>([]);
    readonly #values: Controllable<readonly number[]>;
    readonly #onChange: () =>
        | ((value: SliderValue, details: ChangeDetails) => void)
        | undefined;
    readonly #onCommit: () =>
        | ((value: SliderValue, details: ChangeDetails) => void)
        | undefined;

    constructor(
        value: {
            read: () => SliderValue | undefined;
            write: (value: SliderValue) => void;
            initial: SliderValue;
            onChange: () =>
                | ((value: SliderValue, details: ChangeDetails) => void)
                | undefined;
            onCommit: () =>
                | ((value: SliderValue, details: ChangeDetails) => void)
                | undefined;
        },
        readonly range: boolean,
        readonly options: () => SliderOptions,
        /** The enclosing field's binding, for the thumbs (spec/field.md). */
        readonly field: FieldControlBinding,
    ) {
        this.#values = new Controllable(
            () => {
                const current = value.read();
                return current === undefined ? undefined : toArray(current);
            },
            (next) => value.write(this.output(next)),
            toArray(value.initial),
        );
        this.#onChange = value.onChange;
        this.#onCommit = value.onCommit;
    }

    get values(): readonly number[] {
        return this.#values.value;
    }

    get min(): number {
        return this.options().min;
    }

    get max(): number {
        return this.options().max;
    }

    get orientation(): "horizontal" | "vertical" {
        return this.options().orientation;
    }

    get disabled(): boolean {
        return this.options().disabled;
    }

    /** The value as the consumer gave it: a number, or an array for several thumbs. */
    output(values: readonly number[]): SliderValue {
        return this.range ? [...values] : (values[0] ?? this.min);
    }

    /** Moves thumb `index` to `value` (snapped, within its bounds), reports it, returns the values. */
    setThumb(
        index: number,
        next: number,
        reason: ChangeReason,
    ): readonly number[] {
        const before = this.values;
        const values = moveThumb(before, index, next, this.options());
        if (!sameValues(values, before) && this.#values.set(values)) {
            this.#onChange()?.(this.output(values), { reason });
        }
        return values;
    }

    /** Reports the values (default: the current ones) as committed. */
    commit(values: readonly number[] = this.values): void {
        this.#onCommit()?.(this.output(values), { reason: "none" });
    }

    registerThumb(element: HTMLElement | null, previous: HTMLElement | null) {
        untrack(() => {
            const next = this.thumbs.filter((entry) => entry !== previous);
            if (element !== null && !next.includes(element)) {
                next.push(element);
            }
            // in document order
            this.thumbs = next.sort((a, b) =>
                a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING
                    ? -1
                    : 1,
            );
        });
    }

    startDragging(index: number): void {
        this.activeIndex = index;
        this.dragging = true;
    }

    stopDragging(): void {
        this.dragging = false;
    }
}

export const SliderContext = createContext<SliderState>("Slider");

/** The state every slider part shares. */
export function sliderState(context: SliderState) {
    return {
        orientation: context.orientation,
        disabled: context.disabled,
        dragging: context.dragging,
    };
}
