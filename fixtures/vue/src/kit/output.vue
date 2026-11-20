<script setup lang="ts">
import { computed } from "vue";

// What a scenario prints outside the component, as `key: value` lines (spec/README.md).
const props = defineProps<{
    values: Record<string, string | number | boolean | null | undefined>;
}>();
const text = computed(() =>
    Object.entries(props.values)
        .map(([key, value]) => `${key}: ${value ?? "none"}`)
        .join("\n"),
);
</script>

<template>
    <pre data-testid="output" class="mt-4 rounded-md bg-palette-soft p-2 text-xs">{{ text }}</pre>
</template>
