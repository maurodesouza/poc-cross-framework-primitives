<script lang="ts">
import SingleCalendar from "./single-calendar.svelte";

let { locale }: { locale: string } = $props();
</script>

<SingleCalendar {locale} min={{ year: 2026, month: 11, day: 10 }} max={{ year: 2026, month: 12, day: 5 }} />
