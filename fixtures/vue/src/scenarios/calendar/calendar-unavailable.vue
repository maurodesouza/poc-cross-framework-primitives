<script setup lang="ts">
import SingleCalendar from "./single-calendar.vue";

defineProps<{ locale: string }>();
const isWeekend = (date: { year: number; month: number; day: number }) => {
    const day = new Date(date.year, date.month - 1, date.day).getDay();
    return day === 0 || day === 6;
};
</script>

<template>
    <SingleCalendar :locale="locale" :is-date-unavailable="isWeekend" />
</template>
