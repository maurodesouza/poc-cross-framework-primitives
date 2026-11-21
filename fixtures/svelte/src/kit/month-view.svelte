<script lang="ts">
import { calendar } from "@poc/styles";
import { Calendar } from "@poc/svelte";

// The month header and one grid, as every calendar scenario shows them.
let {
    offset = 0,
    withButtons = true,
}: { offset?: number; withButtons?: boolean } = $props();
</script>

<div class="flex flex-col gap-2"><div class="flex items-center justify-between gap-2">{#if withButtons}<Calendar.PrevButton aria-label="Previous month" class={calendar["prev-button"]}>‹</Calendar.PrevButton>{:else}<span class="size-8"></span>{/if}<Calendar.Heading {offset} class={calendar.heading} />{#if withButtons}<Calendar.NextButton aria-label="Next month" class={calendar["next-button"]}>›</Calendar.NextButton>{:else}<span class="size-8"></span>{/if}</div><Calendar.Grid {offset} class={calendar.grid}><Calendar.GridHeader>{#snippet children(weekday)}<Calendar.HeaderCell {weekday} class={calendar["header-cell"]} />{/snippet}</Calendar.GridHeader><Calendar.GridBody>{#snippet children(week)}<Calendar.Row {week}>{#snippet children(date)}<Calendar.Cell {date} class={calendar.cell} />{/snippet}</Calendar.Row>{/snippet}</Calendar.GridBody></Calendar.Grid></div>
