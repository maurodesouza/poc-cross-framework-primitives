<script lang="ts">
import { calendar } from "@poc/styles";
import { type DateRange, RangeCalendar } from "@poc/svelte";
import { isoRange } from "../../kit/iso.ts";
import MonthView from "../../kit/month-view.svelte";
import Output from "../../kit/output.svelte";

let { locale }: { locale: string } = $props();
let value = $state<DateRange | null>(null);
</script>

<RangeCalendar.Root bind:value={value as never} {locale} class={calendar.root}><MonthView /></RangeCalendar.Root><Output values={{ value: isoRange(value) }} />
