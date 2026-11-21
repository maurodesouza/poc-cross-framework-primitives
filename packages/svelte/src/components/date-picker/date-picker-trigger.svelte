<script lang="ts">
import { elementRef } from "../../utils/element-ref.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { DatePickerContext } from "./date-picker-context.svelte.ts";

/** Opens the picker; its content is the consumer's (for example the formatted value). */
let { child, children, ...rest }: PartProps<{ open: boolean }> = $props();
const context = DatePickerContext.use("DatePicker.Trigger");
const ref = elementRef((element) => (context.trigger = element));
const partState = $derived({ open: context.open });
const partProps = $derived(
    mergeProps(
        {
            type: "button",
            id: context.triggerId,
            "aria-haspopup": "dialog",
            "aria-expanded": context.open ? "true" : "false",
            "aria-controls": context.open ? context.popupId : undefined,
            "data-date-picker-part": "trigger",
            ...stateAttributes({ open: context.open }),
            onclick: () => context.setOpen(!context.open, "trigger-press"),
            ...ref,
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<button {...partProps}>{@render children?.()}</button>{/if}
