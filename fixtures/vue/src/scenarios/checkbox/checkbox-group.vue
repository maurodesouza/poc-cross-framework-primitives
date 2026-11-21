<script setup lang="ts">
import { ref } from "vue";
import { formEntries } from "../../kit/form-entries.ts";
import Output from "../../kit/output.vue";
import { Checkbox, CheckboxGroup } from "../../kit/ui/checkbox.ts";

const TOPPINGS = [
    { value: "cheese", label: "Cheese" },
    { value: "ham", label: "Ham" },
    { value: "pineapple", label: "Pineapple" },
];
const value = ref<string[]>(["cheese"]);
const form = ref<string>();
const onSubmit = (event: Event) => {
    event.preventDefault();
    form.value = formEntries(event.currentTarget as HTMLFormElement);
};
</script>

<template>
    <form class="flex flex-col items-start gap-2" @submit="onSubmit">
        <h2 id="toppings" class="text-sm font-semibold">Toppings</h2>
        <CheckboxGroup v-model:value="value" aria-labelledby="toppings" :all-values="TOPPINGS.map((topping) => topping.value)">
            <label class="flex items-center gap-2 text-sm"><Checkbox.Root parent />All toppings</label>
            <label v-for="topping in TOPPINGS" :key="topping.value" class="flex items-center gap-2 text-sm"><Checkbox.Root name="toppings" :value="topping.value" />{{ topping.label }}</label>
        </CheckboxGroup>
        <button type="submit">Submit</button>
    </form>
    <Output :values="{ value: value.join(',') || undefined, form }" />
</template>
