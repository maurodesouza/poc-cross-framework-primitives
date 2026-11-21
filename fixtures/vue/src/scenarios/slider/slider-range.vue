<script setup lang="ts">
import { ref } from "vue";
import { formEntries } from "../../kit/form-entries.ts";
import Output from "../../kit/output.vue";
import { Slider } from "../../kit/ui/slider.ts";

const LABELS = ["Minimum price", "Maximum price"];
const value = ref<readonly number[]>([20, 80]);
const form = ref<string>();
const onSubmit = (event: Event) => {
    event.preventDefault();
    form.value = formEntries(event.currentTarget as HTMLFormElement);
};
const onValue = (next: number | number[]) => {
    value.value = next as number[];
};
const price = (thumbValue: number) => `$${thumbValue}`;
</script>

<template>
    <form class="flex flex-col items-start gap-2" @submit="onSubmit">
        <Slider.Root :default-value="[20, 80]" :min-steps-between-values="10" name="price" @value-change="onValue">
            <Slider.Control data-testid="control">
                <Slider.Track>
                    <Slider.Indicator />
                    <Slider.Thumb v-for="(label, index) in LABELS" :key="label" :index="index" :aria-label="label" :get-aria-value-text="price" />
                </Slider.Track>
            </Slider.Control>
        </Slider.Root>
        <button type="submit">Submit</button>
    </form>
    <Output :values="{ value: value.join(','), form }" />
</template>
