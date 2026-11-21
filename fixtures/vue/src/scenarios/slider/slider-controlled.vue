<script setup lang="ts">
import { ref } from "vue";
import Output from "../../kit/output.vue";
import { Slider } from "../../kit/ui/slider.ts";

// The consumer refuses any value above 80: the slider stays.
const value = ref(70);
const requested = ref<number>();
const onValue = (next: number | number[]) => {
    requested.value = next as number;
    if ((next as number) <= 80) {
        value.value = next as number;
    }
};
</script>

<template>
    <Slider.Root :value="value" @update:value="onValue">
        <Slider.Control data-testid="control">
            <Slider.Track>
                <Slider.Indicator />
                <Slider.Thumb aria-label="Limited" />
            </Slider.Track>
        </Slider.Control>
    </Slider.Root>
    <Output :values="{ value, requested }" />
</template>
