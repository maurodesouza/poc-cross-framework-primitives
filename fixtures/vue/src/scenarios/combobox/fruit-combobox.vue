<script setup lang="ts">
import type { ChangeDetails } from "@poc/vue";
import { computed, useId } from "vue";
import { Combobox } from "../../kit/ui/combobox.ts";
import { filterFruits } from "./fruits.ts";

const value = defineModel<string | null>("value", { required: true });
const inputValue = defineModel<string>("inputValue", { required: true });
const open = defineModel<boolean>("open", { required: true });
const emit = defineEmits<{
    openChange: [open: boolean, details: ChangeDetails];
}>();
const id = useId();
const filtered = computed(() => filterFruits(inputValue.value));
</script>

<template>
    <Combobox.Root
        v-model:value="value"
        v-model:input-value="inputValue"
        v-model:open="open"
        @open-change="(next: boolean, details: ChangeDetails) => emit('openChange', next, details)"
    >
        <div class="flex flex-col gap-1">
            <label :for="id" class="text-sm font-medium">Fruit</label>
            <div class="flex items-center gap-1">
                <Combobox.Input :id="id" />
                <Combobox.Trigger aria-label="Show fruits">▾</Combobox.Trigger>
            </div>
        </div>
        <Combobox.Portal>
            <Combobox.Positioner :side-offset="4">
                <Combobox.Popup>
                    <Combobox.Empty v-if="filtered.length === 0">No fruit found.</Combobox.Empty>
                    <Combobox.List>
                        <Combobox.Item v-for="fruit in filtered" :key="fruit.value" :value="fruit.value" :disabled="fruit.disabled">{{ fruit.label }}</Combobox.Item>
                    </Combobox.List>
                </Combobox.Popup>
            </Combobox.Positioner>
        </Combobox.Portal>
    </Combobox.Root>
</template>
