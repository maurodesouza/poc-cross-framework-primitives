<script lang="ts">
import { calendar } from "@poc/styles";
import { Calendar } from "@poc/svelte";
import MonthView from "../../kit/month-view.svelte";

let { locale }: { locale: string } = $props();
</script>

<Calendar.Root {locale} visibleMonths={2} class={calendar.root}><div class="flex gap-6"><MonthView /><MonthView offset={1} withButtons={false} /></div></Calendar.Root>
