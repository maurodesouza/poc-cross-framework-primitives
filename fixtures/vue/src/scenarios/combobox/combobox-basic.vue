<script setup lang="ts">
import type { ChangeDetails } from "@poc/vue";
import { ref } from "vue";
import Output from "../../kit/output.vue";
import FruitCombobox from "./fruit-combobox.vue";

const value = ref<string | null>(null);
const input = ref("");
const open = ref(false);
const reason = ref<string>();
</script>

<template>
    <FruitCombobox
        v-model:value="value"
        v-model:input-value="input"
        v-model:open="open"
        @open-change="(_: boolean, details: ChangeDetails) => (reason = details.reason)"
    />
    <Output :values="{ value, input, open, reason }" />
</template>
