<script lang="ts">
import { type PlainDate, toIsoDate } from "@poc/dom";
import type { Snippet } from "svelte";
import { mergeProps } from "../../utils/merge-props.ts";
import CalendarCell from "./calendar-cell.svelte";

/** One week; the `children` snippet gets each date (default: a Cell each). */
let {
    week,
    children,
    ...rest
}: {
    week: PlainDate[];
    children?: Snippet<[PlainDate]>;
    [key: string]: unknown;
} = $props();
const partProps = $derived(mergeProps({ "data-calendar-part": "row" }, rest));
</script>

<tr {...partProps}>{#each week as date (toIsoDate(date))}{#if children}{@render children(date)}{:else}<CalendarCell {date} />{/if}{/each}</tr>
