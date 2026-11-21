<script setup lang="ts">
import { ref } from "vue";
import Output from "../../kit/output.vue";
import { Slider } from "../../kit/ui/slider.ts";

const value = ref(30);
const onValue = (next: number | number[]) => {
    value.value = next as number;
};
</script>

<template>
    <Slider.Root :default-value="30" orientation="vertical" @value-change="onValue">
        <Slider.Control data-testid="control">
            <Slider.Track>
                <Slider.Indicator />
                <Slider.Thumb aria-label="Brightness" />
            </Slider.Track>
        </Slider.Control>
    </Slider.Root>
    <Output :values="{ value }" />
</template>
