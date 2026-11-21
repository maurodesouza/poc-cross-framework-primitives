<script setup lang="ts">
import { ref } from "vue";
import Output from "../../kit/output.vue";
import FruitCombobox from "./fruit-combobox.vue";
import { FRUITS, type Fruit, printValues } from "./fruits.ts";

const value = ref<Fruit | null>(
    FRUITS.find((fruit) => fruit.value === "mango") ?? null,
);
const input = ref("Mango");
const open = ref(false);
const reset = () => {
    value.value = null;
    input.value = "";
};
</script>

<template>
    <FruitCombobox v-model:value="value" v-model:input-value="input" v-model:open="open" />
    <button type="button" class="mt-2" @click="reset">Reset</button>
    <Output :values="{ value: printValues(value), input, open }" />
</template>
