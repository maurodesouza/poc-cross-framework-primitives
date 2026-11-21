<script setup lang="ts">
import { ref, useId } from "vue";
import Output from "../../kit/output.vue";
import { Combobox } from "../../kit/ui/combobox.ts";
import FruitChips from "./fruit-chips.vue";
import FruitPopup from "./fruit-popup.vue";
import { FRUITS, type Fruit, printValues } from "./fruits.ts";

// `multiple`, with chips, a Clear and a Status (spec/combobox.md).
const id = useId();
const value = ref<Fruit[]>(
    FRUITS.filter(
        (fruit) => fruit.value === "apple" || fruit.value === "cherry",
    ),
);
</script>

<template>
    <Combobox.Root multiple :items="FRUITS" v-model:value="value">
        <div class="flex flex-col gap-1">
            <label :for="id" class="text-sm font-medium">Fruits</label>
            <FruitChips :id="id">
                <Combobox.Clear aria-label="Clear fruits">×</Combobox.Clear>
                <Combobox.Trigger aria-label="Show fruits">▾</Combobox.Trigger>
            </FruitChips>
        </div>
        <Combobox.Status>{{ value.length === 1 ? "1 fruit selected." : `${value.length} fruits selected.` }}</Combobox.Status>
        <FruitPopup indicator />
    </Combobox.Root>
    <Output :values="{ value: printValues(value) }" />
</template>
