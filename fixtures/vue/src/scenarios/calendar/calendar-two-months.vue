<script setup lang="ts">
import { Calendar } from "../../kit/ui/calendar.ts";
import MonthView from "../../kit/ui/month-view.vue";

defineProps<{ locale: string }>();
</script>

<template>
    <Calendar.Root :locale="locale" :visible-months="2">
        <div class="flex gap-6">
            <MonthView />
            <MonthView :offset="1" :with-buttons="false" />
        </div>
    </Calendar.Root>
</template>
