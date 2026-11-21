<script lang="ts">
import { type Weekday, weekdays } from "@poc/dom";
import type { Snippet } from "svelte";
import { mergeProps } from "../../utils/merge-props.ts";
import { CalendarContext } from "./calendar-context.svelte.ts";
import CalendarHeaderCell from "./calendar-header-cell.svelte";

/** `thead` with one row; the `children` snippet gets each weekday (default: a HeaderCell each). */
let {
    children,
    ...rest
}: { children?: Snippet<[Weekday]>; [key: string]: unknown } = $props();
const calendar = CalendarContext.use("Calendar.GridHeader");
const days = $derived(weekdays(calendar.locale, calendar.firstDay));
const partProps = $derived(
    mergeProps({ "data-calendar-part": "grid-header" }, rest),
);
</script>

<thead {...partProps}><tr>{#each days as weekday (weekday.index)}{#if children}{@render children(weekday)}{:else}<CalendarHeaderCell {weekday} />{/if}{/each}</tr></thead>
