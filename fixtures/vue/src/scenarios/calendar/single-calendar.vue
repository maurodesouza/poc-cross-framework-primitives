<script setup lang="ts">
import type { PlainDate } from "@poc/vue";
import { ref } from "vue";
import { iso } from "../../kit/iso.ts";
import Output from "../../kit/output.vue";
import { Calendar } from "../../kit/ui/calendar.ts";
import MonthView from "../../kit/ui/month-view.vue";

// A single-date calendar with the scenario's options.
defineProps<{
    locale: string;
    min?: PlainDate;
    max?: PlainDate;
    isDateUnavailable?: (date: PlainDate) => boolean;
}>();
const value = ref<PlainDate | null>(null);
</script>

<template>
    <Calendar.Root v-model:value="value" :locale="locale" :min="min" :max="max" :is-date-unavailable="isDateUnavailable">
        <MonthView />
    </Calendar.Root>
    <Output :values="{ value: iso(value) }" />
</template>
