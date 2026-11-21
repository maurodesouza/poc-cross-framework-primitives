<script lang="ts">
import { calendar, datePicker } from "@poc/styles";
import { type DateRange, DateRangePicker, RangeCalendar } from "@poc/svelte";
import { isoRange } from "../../kit/iso.ts";
import MonthView from "../../kit/month-view.svelte";
import Output from "../../kit/output.svelte";

let { locale }: { locale: string } = $props();
let value = $state<DateRange | null>(null);
</script>

<DateRangePicker.Root bind:value={value as never} {locale}><DateRangePicker.Trigger class={datePicker.trigger}>{#each ["Choose dates: ", isoRange(value) ?? "none"] as run}{run}{/each}</DateRangePicker.Trigger><DateRangePicker.Portal><DateRangePicker.Positioner sideOffset={4} class={datePicker.positioner}><DateRangePicker.Popup class={datePicker.popup}><RangeCalendar.Root class={calendar.root}><MonthView /></RangeCalendar.Root></DateRangePicker.Popup></DateRangePicker.Positioner></DateRangePicker.Portal></DateRangePicker.Root><Output values={{ value: isoRange(value) }} />
