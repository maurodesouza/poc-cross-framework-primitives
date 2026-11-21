<script lang="ts">
import { untrack } from "svelte";
import type { ChangeDetails } from "../../utils/change-details.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import {
    SliderContext,
    SliderState,
    type SliderValue,
    sliderState,
} from "./slider-context.svelte.ts";

/**
 * Holds the slider's values (`bind:value`); renders the `group` and one hidden input per value
 * (spec/slider.md).
 */
let {
    child,
    children,
    value = $bindable(),
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
    ...rest
}: PartProps<{
    orientation: "horizontal" | "vertical";
    disabled: boolean;
    dragging: boolean;
}> & {
    /** A number, or an array of numbers for several thumbs. */
    value?: SliderValue;
    defaultValue?: SliderValue;
    // biome-ignore lint/suspicious/noExplicitAny: a number, or an array for a range
    onValueChange?: (value: any, details: ChangeDetails) => void;
    /** When a drag ends, or after a key changed the value. */
    // biome-ignore lint/suspicious/noExplicitAny: a number, or an array for a range
    onValueCommit?: (value: any, details: ChangeDetails) => void;
    min?: number;
    max?: number;
    step?: number;
    largeStep?: number;
    minStepsBetweenValues?: number;
    orientation?: "horizontal" | "vertical";
    disabled?: boolean;
    name?: string;
} = $props();

const slider = new SliderState(
    {
        read: () => value,
        write: (next) => (value = next),
        initial: untrack(() => defaultValue ?? value ?? min),
        onChange: () => onValueChange,
        onCommit: () => onValueCommit,
    },
    untrack(() => Array.isArray(value ?? defaultValue)),
    () => ({
        min,
        max,
        step,
        largeStep,
        minStepsBetweenValues,
        orientation,
        disabled,
    }),
);
SliderContext.provide(slider);

const partState = $derived(sliderState(slider));
const partProps = $derived(
    mergeProps(
        {
            role: "group",
            "data-slider-part": "root",
            ...stateAttributes(partState),
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<div {...partProps}>{@render children?.()}{#each slider.values as entry, index (index)}<input type="hidden" {name} value={entry} data-slider-part="input" />{/each}</div>{/if}
