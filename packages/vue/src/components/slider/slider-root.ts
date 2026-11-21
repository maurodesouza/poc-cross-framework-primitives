import { moveThumb } from "@poc/dom";
import {
    computed,
    defineComponent,
    h,
    type PropType,
    provide,
    ref,
    shallowRef,
} from "vue";
import { useControllable } from "../../composables/use-controllable.ts";
import { useFieldControl } from "../../composables/use-field-control.ts";
import type { ChangeDetails } from "../../utils/change-details.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { SliderKey, sliderState } from "./slider-context.ts";

type SliderValue = number | readonly number[];

function toArray(value: SliderValue): readonly number[] {
    return typeof value === "number" ? [value] : value;
}

function sameValues(a: readonly number[], b: readonly number[]): boolean {
    return (
        a.length === b.length && a.every((entry, index) => entry === b[index])
    );
}

/** Holds the slider's values (`v-model:value`); renders the `group` and its hidden inputs (spec/slider.md). */
export const SliderRoot = defineComponent({
    name: "SliderRoot",
    inheritAttrs: false,
    props: {
        ...asProp,
        /** A number, or an array of numbers for several thumbs. */
        value: {
            type: [Number, Array] as PropType<SliderValue>,
            default: undefined,
        },
        defaultValue: {
            type: [Number, Array] as PropType<SliderValue>,
            default: undefined,
        },
        min: { type: Number, default: 0 },
        max: { type: Number, default: 100 },
        step: { type: Number, default: 1 },
        largeStep: { type: Number, default: 10 },
        minStepsBetweenValues: { type: Number, default: 0 },
        orientation: {
            type: String as PropType<"horizontal" | "vertical">,
            default: "horizontal",
        },
        disabled: { type: Boolean, default: false },
        name: { type: String, default: undefined },
    },
    emits: {
        "update:value": (_value: number | number[]) => true,
        valueChange: (_value: number | number[], _details: ChangeDetails) =>
            true,
        /** When a drag ends, or after a key changed the value. */
        valueCommit: (_value: number | number[], _details: ChangeDetails) =>
            true,
    },
    setup(props, { attrs, slots, emit }) {
        const range = Array.isArray(props.value ?? props.defaultValue);
        const output = (values: readonly number[]) =>
            range ? [...values] : (values[0] as number);
        const state = useControllable<readonly number[], ChangeDetails>(
            () =>
                props.value === undefined ? undefined : toArray(props.value),
            toArray(props.defaultValue ?? props.min),
            (next, details) => {
                emit("update:value", output(next));
                emit("valueChange", output(next), details);
            },
        );
        const values = computed(() => state.value.value);
        const firstInput = shallowRef<HTMLInputElement | null>(null);
        const field = useFieldControl({
            id: () => undefined,
            labelable: false,
            value: () => output(values.value),
            // a slider always has a value
            filled: () => true,
            input: () => firstInput.value,
        });
        const dragging = ref(false);
        const activeIndex = ref(-1);
        const thumbs = shallowRef<readonly HTMLElement[]>([]);
        const context = {
            field,
            values,
            min: () => props.min,
            max: () => props.max,
            step: () => props.step,
            largeStep: () => props.largeStep,
            minStepsBetweenValues: () => props.minStepsBetweenValues,
            orientation: () => props.orientation,
            disabled: () => props.disabled || field.disabled(),
            dragging,
            activeIndex,
            setThumb(
                index: number,
                next: number,
                reason: ChangeDetails["reason"],
            ) {
                const before = values.value;
                const moved = moveThumb(before, index, next, {
                    min: props.min,
                    max: props.max,
                    step: props.step,
                    minStepsBetweenValues: props.minStepsBetweenValues,
                });
                if (!sameValues(moved, before)) {
                    state.set(moved, { reason });
                }
                return moved;
            },
            commit(committed?: readonly number[]) {
                emit("valueCommit", output(committed ?? values.value), {
                    reason: "none",
                });
            },
            thumbs,
            registerThumb(element: HTMLElement) {
                // in document order
                thumbs.value = [...thumbs.value, element].sort((a, b) =>
                    a.compareDocumentPosition(b) &
                    Node.DOCUMENT_POSITION_FOLLOWING
                        ? -1
                        : 1,
                );
                return () => {
                    thumbs.value = thumbs.value.filter(
                        (entry) => entry !== element,
                    );
                };
            },
        };
        provide(SliderKey, context);
        return () => {
            const current = sliderState(context);
            return renderPart(
                "div",
                { attrs, slots },
                props.as,
                current,
                {
                    role: "group",
                    "aria-labelledby": field.aria()["aria-labelledby"],
                    "data-slider-part": "root",
                    ...field.attributes(),
                    ...stateAttributes({
                        orientation: current.orientation,
                        disabled: current.disabled,
                        dragging: current.dragging,
                    }),
                },
                () => [
                    slots.default?.({ state: current }),
                    // one hidden input per value, in order
                    values.value.map((entry: number, index: number) =>
                        h("input", {
                            ref:
                                index === 0
                                    ? (element: unknown) => {
                                          firstInput.value =
                                              element as HTMLInputElement | null;
                                      }
                                    : undefined,
                            type: "hidden",
                            name: field.name() ?? props.name,
                            value: entry,
                            "data-slider-part": "input",
                        }),
                    ),
                ],
            );
        };
    },
});
