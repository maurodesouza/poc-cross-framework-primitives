<script setup lang="ts">
import SingleCalendar from "./single-calendar.vue";

defineProps<{ locale: string }>();
</script>

<template>
    <SingleCalendar :locale="locale" :min="{ year: 2026, month: 11, day: 10 }" :max="{ year: 2026, month: 12, day: 5 }" />
</template>
