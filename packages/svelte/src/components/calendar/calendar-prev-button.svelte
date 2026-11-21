<script lang="ts">
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { CalendarContext } from "./calendar-context.svelte.ts";

/** Shows the previous page of months; the consumer names it. */
let { child, children, ...rest }: PartProps<{ disabled: boolean }> = $props();
const calendar = CalendarContext.use("Calendar.PrevButton");
const disabled = $derived(calendar.disabled || !calendar.canPage(-1));
const grids = $derived(
    Array.from({ length: calendar.visibleMonths }, (_, offset) =>
        calendar.gridId(offset),
    ).join(" "),
);
const partState = $derived({ disabled });
const partProps = $derived(
    mergeProps(
        {
            type: "button",
            disabled,
            "aria-controls": grids,
            "data-calendar-part": "prev-button",
            ...stateAttributes({ disabled }),
            onclick: () => calendar.page(-1),
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<button {...partProps}>{@render children?.()}</button>{/if}
