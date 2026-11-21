<script lang="ts">
import SingleCalendar from "./single-calendar.svelte";

let { locale }: { locale: string } = $props();
const isWeekend = (date: { year: number; month: number; day: number }) => {
    const day = new Date(date.year, date.month - 1, date.day).getDay();
    return day === 0 || day === 6;
};
</script>

<SingleCalendar {locale} isDateUnavailable={isWeekend} />
