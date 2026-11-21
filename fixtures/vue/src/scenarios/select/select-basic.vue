<script setup lang="ts">
import { ref } from "vue";
import { formEntries } from "../../kit/form-entries.ts";
import Output from "../../kit/output.vue";
import FruitSelect from "./fruit-select.vue";

const value = ref<string | null>(null);
const open = ref(false);
const reason = ref<string>();
const form = ref<string>();
const onSubmit = (event: Event) => {
    event.preventDefault();
    form.value = formEntries(event.currentTarget as HTMLFormElement);
};
const onValue = (next: string | null) => {
    value.value = next;
};
const onOpen = (next: boolean, why: string) => {
    open.value = next;
    reason.value = why;
};
</script>

<template>
    <form class="flex flex-col items-start gap-2" @submit="onSubmit">
        <label for="fruit" class="text-sm font-medium">Fruit</label>
        <FruitSelect id="fruit" name="fruit" required @value-change="onValue" @open-change="onOpen" />
        <div class="flex gap-2">
            <button type="submit">Submit</button>
            <button type="reset">Reset</button>
        </div>
    </form>
    <Output :values="{ value, open, reason, form }" />
</template>
