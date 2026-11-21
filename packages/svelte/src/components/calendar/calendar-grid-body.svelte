<script lang="ts">
import { monthGrid, type PlainDate, toIsoDate } from "@poc/dom";
import type { Snippet } from "svelte";
import { mergeProps } from "../../utils/merge-props.ts";
import {
    CalendarContext,
    CalendarGridContext,
} from "./calendar-context.svelte.ts";
import CalendarRow from "./calendar-row.svelte";

/** `tbody`; the `children` snippet gets each week, 6 of them (default: a Row each). */
let {
    children,
    ...rest
}: { children?: Snippet<[PlainDate[]]>; [key: string]: unknown } = $props();
const calendar = CalendarContext.use("Calendar.GridBody");
const month = CalendarGridContext.maybe();
const weeks = $derived.by(() => {
    const shown = month?.() ?? calendar.visibleStart;
    return monthGrid(shown.year, shown.month, calendar.firstDay);
});
const partProps = $derived(
    mergeProps({ "data-calendar-part": "grid-body" }, rest),
);
</script>

<tbody {...partProps}>{#each weeks as week (toIsoDate(week[0] as PlainDate))}{#if children}{@render children(week)}{:else}<CalendarRow {week} />{/if}{/each}</tbody>
