<script setup lang="ts">
import { ref, useId } from "vue";
import Output from "../../kit/output.vue";
import { Combobox } from "../../kit/ui/combobox.ts";
import { PRODUCE, type Produce } from "./combobox-items.ts";
import { printValues } from "./fruits.ts";

// Grouped items, filtered across the groups (spec/combobox.md).
const id = useId();
const value = ref<Produce | null>(null);
</script>

<template>
    <Combobox.Root :items="PRODUCE" v-model:value="value">
        <div class="flex flex-col gap-1">
            <label :for="id" class="text-sm font-medium">Produce</label>
            <Combobox.InputGroup>
                <Combobox.Input :id="id" />
            </Combobox.InputGroup>
        </div>
        <Combobox.Portal>
            <Combobox.Positioner :side-offset="4">
                <Combobox.Popup>
                    <Combobox.Empty>Nothing found.</Combobox.Empty>
                    <Combobox.List v-slot="{ entry: group, index }">
                        <Combobox.Separator v-if="index > 0" />
                        <Combobox.Group>
                            <Combobox.GroupLabel>{{ group.label }}</Combobox.GroupLabel>
                            <Combobox.Item v-for="item in group.items" :key="item.value" :value="item">{{ item.label }}</Combobox.Item>
                        </Combobox.Group>
                    </Combobox.List>
                </Combobox.Popup>
            </Combobox.Positioner>
        </Combobox.Portal>
    </Combobox.Root>
    <Output :values="{ value: printValues(value) }" />
</template>
