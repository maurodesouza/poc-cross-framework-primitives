<script setup lang="ts">
import {
    type ChangeDetails,
    type PlainDate,
    DatePicker as Primitive,
} from "@poc/vue";
import { ref } from "vue";
import { iso } from "../../kit/iso.ts";
import Output from "../../kit/output.vue";
import { Calendar } from "../../kit/ui/calendar.ts";
import { DatePicker } from "../../kit/ui/date-picker.ts";
import MonthView from "../../kit/ui/month-view.vue";

defineProps<{ locale: string }>();
const value = ref<PlainDate | null>(null);
const open = ref(false);
const reason = ref<string>();
</script>

<template>
    <Primitive.Root
        v-model:value="value"
        v-model:open="open"
        :locale="locale"
        @open-change="(_: boolean, details: ChangeDetails) => (reason = details.reason)"
    >
        <DatePicker.Trigger>Choose date: {{ iso(value) ?? "none" }}</DatePicker.Trigger>
        <DatePicker.Portal>
            <DatePicker.Positioner :side-offset="4">
                <DatePicker.Popup>
                    <Calendar.Root>
                        <MonthView />
                    </Calendar.Root>
                </DatePicker.Popup>
            </DatePicker.Positioner>
        </DatePicker.Portal>
    </Primitive.Root>
    <Output :values="{ value: iso(value), open, reason }" />
</template>
