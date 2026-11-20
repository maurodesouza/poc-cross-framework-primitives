<script setup lang="ts">
import { calendar } from "@poc/styles";
import { Calendar } from "@poc/vue";

// The month header and one grid, as every calendar scenario shows them.
withDefaults(defineProps<{ offset?: number; withButtons?: boolean }>(), {
    offset: 0,
    withButtons: true,
});
</script>

<template>
    <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between gap-2">
            <Calendar.PrevButton v-if="withButtons" aria-label="Previous month" :class="calendar['prev-button']">‹</Calendar.PrevButton>
            <span v-else class="size-8" />
            <Calendar.Heading :offset="offset" :class="calendar.heading" />
            <Calendar.NextButton v-if="withButtons" aria-label="Next month" :class="calendar['next-button']">›</Calendar.NextButton>
            <span v-else class="size-8" />
        </div>
        <Calendar.Grid :offset="offset" :class="calendar.grid">
            <Calendar.GridHeader v-slot="{ weekday }">
                <Calendar.HeaderCell :key="weekday.index" :weekday="weekday" :class="calendar['header-cell']" />
            </Calendar.GridHeader>
            <Calendar.GridBody v-slot="{ week }">
                <Calendar.Row :key="`${week[0].year}-${week[0].month}-${week[0].day}`" :week="week" v-slot="{ date }">
                    <Calendar.Cell :key="`${date.year}-${date.month}-${date.day}`" :date="date" :class="calendar.cell" />
                </Calendar.Row>
            </Calendar.GridBody>
        </Calendar.Grid>
    </div>
</template>
