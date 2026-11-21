<script setup lang="ts">
import { ref } from "vue";
import { formEntries } from "../../kit/form-entries.ts";
import Output from "../../kit/output.vue";
import { Slider } from "../../kit/ui/slider.ts";

// Also `/slider/rtl` (the page sets `dir`).
const value = ref<number>();
const committed = ref<number>();
const form = ref<string>();
const onSubmit = (event: Event) => {
    event.preventDefault();
    form.value = formEntries(event.currentTarget as HTMLFormElement);
};
const onValue = (next: number | number[]) => {
    value.value = next as number;
};
const onCommit = (next: number | number[]) => {
    committed.value = next as number;
};
</script>

<template>
    <form class="flex flex-col items-start gap-2" @submit="onSubmit">
        <Slider.Root :default-value="50" name="volume" @value-change="onValue" @value-commit="onCommit">
            <Slider.Control data-testid="control">
                <Slider.Track>
                    <Slider.Indicator />
                    <Slider.Thumb aria-label="Volume" />
                </Slider.Track>
            </Slider.Control>
        </Slider.Root>
        <button type="submit">Submit</button>
    </form>
    <Output :values="{ value, committed, form }" />
</template>
