<script setup lang="ts">
import type { ChangeDetails } from "@poc/vue";
import { Select } from "../../kit/ui/select.ts";
import { FRUIT_ITEMS } from "./fruit-items.ts";

// The Select of the select scenarios.
defineProps<{
    id: string;
    name?: string;
    required?: boolean;
    value?: string | null;
}>();
const emit = defineEmits<{
    valueChange: [value: string | null];
    openChange: [open: boolean, reason: string];
}>();
</script>

<template>
    <Select.Root
        :items="FRUIT_ITEMS"
        :name="name"
        :required="required"
        :value="value"
        @value-change="(next: string | null) => emit('valueChange', next)"
        @open-change="(open: boolean, details: ChangeDetails) => emit('openChange', open, details.reason)"
    >
        <Select.Trigger :id="id"><Select.Value placeholder="Choose a fruit" /></Select.Trigger>
        <Select.Portal>
            <Select.Positioner>
                <Select.Popup>
                    <Select.List>
                        <Select.Item v-for="item in FRUIT_ITEMS" :key="item.value" :value="item.value">{{ item.label }}<Select.ItemIndicator>✓</Select.ItemIndicator></Select.Item>
                    </Select.List>
                </Select.Popup>
            </Select.Positioner>
        </Select.Portal>
    </Select.Root>
</template>
