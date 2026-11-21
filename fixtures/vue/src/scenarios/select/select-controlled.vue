<script setup lang="ts">
import { ref } from "vue";
import Output from "../../kit/output.vue";
import FruitSelect from "./fruit-select.vue";

// The consumer refuses Cherry: the value stays.
const value = ref<string | null>("apple");
const requested = ref<string | null>();
const onValue = (next: string | null) => {
    requested.value = next;
    if (next !== "cherry") {
        value.value = next;
    }
};
</script>

<template>
    <div class="flex flex-col items-start gap-2">
        <label for="fruit" class="text-sm font-medium">Fruit</label>
        <FruitSelect id="fruit" :value="value" @value-change="onValue" />
    </div>
    <Output :values="{ value, requested }" />
</template>
