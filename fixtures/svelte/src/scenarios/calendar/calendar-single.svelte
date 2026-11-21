<script lang="ts">
import SingleCalendar from "./single-calendar.svelte";

let { locale }: { locale: string } = $props();
</script>

<SingleCalendar {locale} />
