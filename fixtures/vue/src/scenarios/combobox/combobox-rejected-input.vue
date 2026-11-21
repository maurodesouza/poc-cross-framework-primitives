<script setup lang="ts">
import { ref } from "vue";
import Output from "../../kit/output.vue";
import FruitCombobox from "./fruit-combobox.vue";

// The consumer refuses an input value with a digit: the input keeps the consumer's value.
const value = ref<string | null>(null);
const input = ref("");
const open = ref(false);
const onInputValue = (next: string) => {
    if (!/\d/.test(next)) {
        input.value = next;
    }
};
</script>

<template>
    <FruitCombobox v-model:value="value" :input-value="input" @update:input-value="onInputValue" v-model:open="open" />
    <Output :values="{ value, input, open }" />
</template>
