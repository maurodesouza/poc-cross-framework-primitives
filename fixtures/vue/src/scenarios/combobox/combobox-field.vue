<script setup lang="ts">
import { ref } from "vue";
import { formEntries } from "../../kit/form-entries.ts";
import Output from "../../kit/output.vue";
import { Combobox } from "../../kit/ui/combobox.ts";
import { Field } from "../../kit/ui/field.ts";
import FruitPopup from "./fruit-popup.vue";
import { FRUITS } from "./fruits.ts";

// The combobox inside a Field: labelled, described and validated by it (spec/combobox.md).
const form = ref<string>();
const onSubmit = (event: Event) => {
    event.preventDefault();
    form.value = formEntries(event.currentTarget as HTMLFormElement);
};
</script>

<template>
    <form class="flex flex-col items-start gap-4" @submit="onSubmit">
        <Field.Root name="fruit">
            <Field.Label>Fruit</Field.Label>
            <Combobox.Root :items="FRUITS" required>
                <Combobox.InputGroup>
                    <Combobox.Input />
                    <Combobox.Clear aria-label="Clear fruit">×</Combobox.Clear>
                    <Combobox.Trigger aria-label="Show fruits">▾</Combobox.Trigger>
                </Combobox.InputGroup>
                <FruitPopup />
            </Combobox.Root>
            <Field.Description>Pick one.</Field.Description>
            <Field.Error>Choose a fruit.</Field.Error>
        </Field.Root>
        <button type="submit">Submit</button>
    </form>
    <Output :values="{ form }" />
</template>
