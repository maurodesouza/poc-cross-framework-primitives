<script setup lang="ts">
import type { ChangeDetails } from "@poc/vue";
import { useId } from "vue";
import { Combobox } from "../../kit/ui/combobox.ts";
import FruitPopup from "./fruit-popup.vue";
import { FRUITS, type Fruit } from "./fruits.ts";

// The combobox of `/combobox/basic` (spec/combobox.md).
const value = defineModel<Fruit | null>("value", { required: true });
const inputValue = defineModel<string>("inputValue", { required: true });
const open = defineModel<boolean>("open", { required: true });
const emit = defineEmits<{
    openChange: [open: boolean, details: ChangeDetails];
}>();
const id = useId();
</script>

<template>
    <Combobox.Root
        :items="FRUITS"
        v-model:value="value"
        v-model:input-value="inputValue"
        v-model:open="open"
        @open-change="(next: boolean, details: ChangeDetails) => emit('openChange', next, details)"
    >
        <div class="flex flex-col gap-1">
            <label :for="id" class="text-sm font-medium">Fruit</label>
            <Combobox.InputGroup>
                <Combobox.Input :id="id" />
                <Combobox.Clear aria-label="Clear fruit">×</Combobox.Clear>
                <Combobox.Trigger aria-label="Show fruits">▾</Combobox.Trigger>
            </Combobox.InputGroup>
        </div>
        <FruitPopup />
    </Combobox.Root>
</template>
