<script setup lang="ts">
import type { DateRange } from "@poc/vue";
import { ref } from "vue";
import { isoRange } from "../../kit/iso.ts";
import Output from "../../kit/output.vue";
import { RangeCalendar } from "../../kit/ui/calendar.ts";
import MonthView from "../../kit/ui/month-view.vue";

defineProps<{ locale: string }>();
const value = ref<DateRange | null>(null);
</script>

<template>
    <RangeCalendar.Root v-model:value="value" :locale="locale">
        <MonthView />
    </RangeCalendar.Root>
    <Output :values="{ value: isoRange(value) }" />
</template>
