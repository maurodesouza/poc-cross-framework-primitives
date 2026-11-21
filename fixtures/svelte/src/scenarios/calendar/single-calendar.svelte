<script lang="ts">
import { calendar } from "@poc/styles";
import { Calendar, type PlainDate } from "@poc/svelte";
import { iso } from "../../kit/iso.ts";
import MonthView from "../../kit/month-view.svelte";
import Output from "../../kit/output.svelte";

// A single-date calendar with the scenario's options.
let {
    locale,
    min,
    max,
    isDateUnavailable,
}: {
    locale: string;
    min?: PlainDate;
    max?: PlainDate;
    isDateUnavailable?: (date: PlainDate) => boolean;
} = $props();
let value = $state<PlainDate | null>(null);
</script>

<Calendar.Root bind:value={value as never} {locale} {min} {max} {isDateUnavailable} class={calendar.root}><MonthView /></Calendar.Root><Output values={{ value: iso(value) }} />
