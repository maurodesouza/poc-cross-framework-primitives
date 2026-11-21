import {
    booleanAttribute,
    computed,
    Directive,
    effect,
    input,
    output,
    signal,
    untracked,
} from "@angular/core";
import { moveThumb } from "@poc/dom";
import type {
    ChangeDetails,
    ChangeReason,
    ValueChangeEvent,
} from "../../utils/change-details.ts";
import { controllable } from "../../utils/controllable.ts";
import { fieldControl, writeFieldAria } from "../../utils/field-control.ts";
import { injectHost } from "../../utils/host-element.ts";
import { dataValues } from "../../utils/state-attributes.ts";

/** A number, or an array of numbers for several thumbs. */
export type SliderValue = number | readonly number[];

/** The state every slider part shares. */
export interface SliderState {
    orientation: "horizontal" | "vertical";
    disabled: boolean;
    dragging: boolean;
}

function toArray(value: SliderValue): readonly number[] {
    return typeof value === "number" ? [value] : value;
}

function sameValues(a: readonly number[], b: readonly number[]): boolean {
    return (
        a.length === b.length && a.every((entry, index) => entry === b[index])
    );
}

/**
 * Holds the slider's values; the `group` with one hidden input per value at its end
 * (spec/slider.md): `<div sliderRoot [(value)]="volume" name="volume">`.
 */
@Directive({
    selector: "[sliderRoot]",
    exportAs: "sliderRoot",
    host: {
        role: "group",
        "data-slider-part": "root",
        "[attr.data-invalid]": "field.data().invalid",
        "[attr.data-valid]": "field.data().valid",
        "[attr.data-dirty]": "field.data().dirty",
        "[attr.data-touched]": "field.data().touched",
        "[attr.data-filled]": "field.data().filled",
        "[attr.data-focused]": "field.data().focused",
        "[attr.data-orientation]": "data().orientation",
        "[attr.data-disabled]": "data().disabled",
        "[attr.data-dragging]": "data().dragging",
    },
})
export class SliderRoot {
    readonly value = input<SliderValue | undefined>(undefined);
    readonly valueChange = output<SliderValue>();
    readonly defaultValue = input<SliderValue | undefined>(undefined);
    readonly valueChangeDetails = output<ValueChangeEvent<SliderValue>>();
    /** When a drag ends, or after a key changed the value. */
    readonly valueCommit = output<SliderValue>();
    readonly min = input(0);
    readonly max = input(100);
    readonly step = input(1);
    readonly largeStep = input(10);
    readonly minStepsBetweenValues = input(0);
    readonly orientation = input<"horizontal" | "vertical">("horizontal");
    readonly disabled = input(false, { transform: booleanAttribute });
    readonly name = input<string | undefined>(undefined);

    private readonly range = computed(() =>
        Array.isArray(this.value() ?? this.defaultValue()),
    );
    private readonly current = controllable<readonly number[], ChangeDetails>(
        computed(() => {
            const value = this.value();
            return value === undefined ? undefined : toArray(value);
        }),
        { emit: (next) => this.valueChange.emit(this.shape(next)) },
        () => toArray(this.defaultValue() ?? this.min()),
        (next, details) =>
            this.valueChangeDetails.emit({ value: this.shape(next), details }),
    );
    readonly values = this.current.value;
    /** One hidden input per value, in order. */
    private readonly inputs: HTMLInputElement[] = [];
    /** The enclosing field's binding, for the root and the thumbs (spec/field.md). */
    readonly field = fieldControl({
        id: signal(undefined),
        labelable: false,
        value: computed(() => {
            const values = this.values();
            return this.range() ? [...values] : (values[0] ?? 0);
        }),
        // a slider always has a value
        filled: signal(true),
        input: () => this.inputs[0] ?? null,
    });
    /** Its own `disabled`, or the field's. */
    readonly isDisabled = computed(
        () => this.disabled() || this.field.disabled(),
    );
    readonly dragging = signal(false);
    /** The thumb a pointer drags (or last pressed), else -1. */
    readonly activeIndex = signal(-1);
    /** The thumbs, in document order: the default `index`, and the one to focus. */
    readonly thumbs = signal<readonly HTMLElement[]>([]);
    readonly state = computed<SliderState>(() => ({
        orientation: this.orientation(),
        disabled: this.isDisabled(),
        dragging: this.dragging(),
    }));
    protected readonly data = computed(() => dataValues(this.state()));

    constructor() {
        const host = injectHost();
        writeFieldAria(this.field, host, {
            "aria-labelledby": this.field.labelledBy,
        });
        // one `type="hidden"` input per value, after the consumer's children (as React renders)
        const inputs = this.inputs;
        effect(() => {
            const values = this.values();
            const name = this.field.name() ?? this.name();
            untracked(() => {
                while (inputs.length > values.length) {
                    inputs.pop()?.remove();
                }
                while (inputs.length < values.length) {
                    const input = document.createElement("input");
                    input.type = "hidden";
                    input.setAttribute("data-slider-part", "input");
                    host.appendChild(input);
                    inputs.push(input);
                }
                values.forEach((value, index) => {
                    const input = inputs[index] as HTMLInputElement;
                    input.value = String(value);
                    if (name === undefined) {
                        input.removeAttribute("name");
                    } else {
                        input.name = name;
                    }
                });
            });
        });
    }

    private shape(values: readonly number[]): SliderValue {
        return untracked(this.range) ? [...values] : (values[0] ?? 0);
    }

    /** Moves thumb `index` to `value` (snapped, within its bounds), reports it, returns the values. */
    setThumb(
        index: number,
        value: number,
        reason: ChangeReason,
    ): readonly number[] {
        const before = untracked(this.values);
        const next = moveThumb(before, index, value, {
            min: this.min(),
            max: this.max(),
            step: this.step(),
            minStepsBetweenValues: this.minStepsBetweenValues(),
        });
        if (!sameValues(next, before)) {
            this.current.set(next, { reason });
        }
        return next;
    }

    /** Reports the values (default: the current ones) as committed. */
    commit(values?: readonly number[]): void {
        this.valueCommit.emit(this.shape(values ?? untracked(this.values)));
    }

    registerThumb(element: HTMLElement): () => void {
        this.thumbs.update((list) =>
            [...list.filter((entry) => entry !== element), element].sort(
                (a, b) =>
                    a.compareDocumentPosition(b) &
                    Node.DOCUMENT_POSITION_FOLLOWING
                        ? -1
                        : 1,
            ),
        );
        return () =>
            this.thumbs.update((list) =>
                list.filter((entry) => entry !== element),
            );
    }
}
