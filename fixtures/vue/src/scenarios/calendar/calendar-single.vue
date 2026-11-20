<script setup lang="ts">
import SingleCalendar from "./single-calendar.vue";

defineProps<{ locale: string }>();
</script>

<template>
    <SingleCalendar :locale="locale" />
</template>
