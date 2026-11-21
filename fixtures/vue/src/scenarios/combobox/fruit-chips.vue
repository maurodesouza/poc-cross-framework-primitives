<script setup lang="ts">
import { Combobox } from "../../kit/ui/combobox.ts";

// Chips for a `multiple` combobox: a Chip per value, with its ChipRemove, then the Input, then
// the given buttons.
defineProps<{ id: string }>();
</script>

<template>
    <Combobox.Chips>
        <Combobox.Value v-slot="{ value: items }">
            <Combobox.Chip v-for="item in items" :key="item.value">{{ item.label }}<Combobox.ChipRemove :aria-label="`Remove ${item.label}`">×</Combobox.ChipRemove></Combobox.Chip>
            <Combobox.Input :id="id" />
        </Combobox.Value>
        <slot />
    </Combobox.Chips>
</template>
