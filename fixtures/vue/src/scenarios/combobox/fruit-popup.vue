<script setup lang="ts">
import { Combobox } from "../../kit/ui/combobox.ts";

// The fruits' popup: an Empty and the List, each Item with its label (and indicator).
withDefaults(defineProps<{ indicator?: boolean }>(), { indicator: false });
</script>

<template>
    <Combobox.Portal>
        <Combobox.Positioner :side-offset="4">
            <Combobox.Popup>
                <Combobox.Empty>No fruit found.</Combobox.Empty>
                <Combobox.List v-slot="{ entry: fruit }">
                    <Combobox.Item :key="fruit.value" :value="fruit" :disabled="fruit.disabled">{{ fruit.label }}<Combobox.ItemIndicator v-if="indicator">✓</Combobox.ItemIndicator></Combobox.Item>
                </Combobox.List>
            </Combobox.Popup>
        </Combobox.Positioner>
    </Combobox.Portal>
</template>
