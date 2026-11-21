<script lang="ts">
import { addMonths, formatMonthYear } from "@poc/dom";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { CalendarContext } from "./calendar-context.svelte.ts";

/** The month a grid shows, from `Intl` unless children are given. */
let {
    child,
    children,
    offset = 0,
    ...rest
}: PartProps<{ month: string }> & { offset?: number } = $props();
const calendar = CalendarContext.use("Calendar.Heading");
const month = $derived(
    formatMonthYear(calendar.locale, addMonths(calendar.visibleStart, offset)),
);
const partState = $derived({ month });
const partProps = $derived(
    mergeProps(
        {
            id: calendar.headingId(offset),
            "aria-live": offset === 0 ? "polite" : undefined,
            "data-calendar-part": "heading",
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<h2 {...partProps}>{#if children}{@render children()}{:else}{month}{/if}</h2>{/if}
