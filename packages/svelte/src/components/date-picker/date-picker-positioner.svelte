<script lang="ts">
import type { Align, Side } from "@poc/dom";
import { elementRef } from "../../utils/element-ref.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { usePositioner } from "../../utils/positioner.svelte.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { DatePickerContext } from "./date-picker-context.svelte.ts";

let {
    child,
    children,
    side,
    align,
    sideOffset,
    alignOffset,
    collisionPadding,
    anchor,
    ...rest
}: PartProps<{ open: boolean; side: string; align: string }> & {
    side?: Side;
    align?: Align;
    sideOffset?: number;
    alignOffset?: number;
    collisionPadding?: number;
    anchor?: Element | null;
} = $props();
const context = DatePickerContext.use("DatePicker.Positioner");
const ref = elementRef((element) => (context.positioner = element));
usePositioner(
    () => ({ side, align, sideOffset, alignOffset, collisionPadding, anchor }),
    { side: "bottom", align: "start" },
    () => context.trigger,
    () => context.positioner,
    () => null,
    (placed) => {
        context.placed = placed;
    },
);
const partState = $derived({ open: context.open, ...context.placed });
const partProps = $derived(
    mergeProps(
        {
            role: "presentation",
            "data-date-picker-part": "positioner",
            ...stateAttributes({
                open: context.open,
                side: context.placed.side,
                align: context.placed.align,
            }),
            ...ref,
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<div {...partProps}>{@render children?.()}</div>{/if}
