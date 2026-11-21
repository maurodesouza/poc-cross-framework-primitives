<script setup lang="ts">
import { ref } from "vue";
import { formEntries } from "../../kit/form-entries.ts";
import Output from "../../kit/output.vue";
import { Checkbox } from "../../kit/ui/checkbox.ts";
import { Field } from "../../kit/ui/field.ts";
import { Select } from "../../kit/ui/select.ts";
import { Slider } from "../../kit/ui/slider.ts";
import { FRUIT_ITEMS } from "../select/fruit-items.ts";

const form = ref<string>();
const onSubmit = (event: Event) => {
    event.preventDefault();
    form.value = formEntries(event.currentTarget as HTMLFormElement);
};
</script>

<template>
    <form class="flex flex-col items-start gap-4" @submit="onSubmit">
        <Field.Root name="terms">
            <div class="flex items-center gap-2">
                <Checkbox.Root required />
                <Field.Label>Accept terms</Field.Label>
            </div>
            <Field.Description>Required to continue.</Field.Description>
            <Field.Error>You must accept the terms.</Field.Error>
        </Field.Root>
        <Field.Root name="fruit">
            <Field.Label>Fruit</Field.Label>
            <Select.Root :items="FRUIT_ITEMS" required>
                <Select.Trigger><Select.Value placeholder="Choose a fruit" /></Select.Trigger>
                <Select.Portal>
                    <Select.Positioner>
                        <Select.Popup>
                            <Select.List>
                                <Select.Item v-for="item in FRUIT_ITEMS" :key="item.value" :value="item.value">{{ item.label }}<Select.ItemIndicator>✓</Select.ItemIndicator></Select.Item>
                            </Select.List>
                        </Select.Popup>
                    </Select.Positioner>
                </Select.Portal>
            </Select.Root>
            <Field.Description>Pick one.</Field.Description>
            <Field.Error>Choose a fruit.</Field.Error>
        </Field.Root>
        <Field.Root name="volume">
            <Field.Label>Volume</Field.Label>
            <Slider.Root :default-value="50">
                <Slider.Control>
                    <Slider.Track>
                        <Slider.Indicator />
                        <Slider.Thumb />
                    </Slider.Track>
                </Slider.Control>
            </Slider.Root>
            <Field.Description>From 0 to 100.</Field.Description>
        </Field.Root>
        <button type="submit">Submit</button>
    </form>
    <Output :values="{ form }" />
</template>
