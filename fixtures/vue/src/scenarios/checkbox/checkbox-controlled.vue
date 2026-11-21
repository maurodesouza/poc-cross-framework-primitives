<script setup lang="ts">
import { ref } from "vue";
import Output from "../../kit/output.vue";
import { Checkbox } from "../../kit/ui/checkbox.ts";

// The consumer refuses to clear the checkbox: it stays checked.
const checked = ref(true);
const requested = ref<boolean>();
const onChecked = (next: boolean) => {
    requested.value = next;
    if (next) {
        checked.value = true;
    }
};
</script>

<template>
    <label class="flex items-center gap-2 text-sm"><Checkbox.Root :checked="checked" @update:checked="onChecked" />Keep me signed in</label>
    <Output :values="{ checked, requested }" />
</template>
