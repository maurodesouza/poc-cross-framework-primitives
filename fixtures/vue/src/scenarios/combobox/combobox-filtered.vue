<script setup lang="ts">
import { computed, ref, useId } from "vue";
import Output from "../../kit/output.vue";
import { Combobox } from "../../kit/ui/combobox.ts";
import { CITIES } from "./combobox-items.ts";
import { FRUITS } from "./fruits.ts";

// The default filter with a limit, and a list the consumer filters (spec/combobox.md).
const FRUIT_LABELS = FRUITS.map((fruit) => fruit.label);
const cityId = useId();
const fruitId = useId();
const city = ref<string | null>(null);
const fruit = ref<string | null>(null);
const query = ref("");
const filtered = computed(() => {
    const needle = query.value.trim().toLowerCase();
    return FRUIT_LABELS.filter((label) =>
        label.toLowerCase().startsWith(needle),
    );
});
</script>

<template>
    <div class="flex flex-col gap-4">
        <Combobox.Root :items="CITIES" :limit="4" v-model:value="city">
            <div class="flex flex-col gap-1">
                <label :for="cityId" class="text-sm font-medium">City</label>
                <Combobox.InputGroup>
                    <Combobox.Input :id="cityId" />
                </Combobox.InputGroup>
            </div>
            <Combobox.Portal>
                <Combobox.Positioner :side-offset="4">
                    <Combobox.Popup>
                        <Combobox.Empty>No city found.</Combobox.Empty>
                        <Combobox.List v-slot="{ entry }">
                            <Combobox.Item :key="entry" :value="entry">{{ entry }}</Combobox.Item>
                        </Combobox.List>
                    </Combobox.Popup>
                </Combobox.Positioner>
            </Combobox.Portal>
        </Combobox.Root>
        <Combobox.Root v-model:value="fruit" v-model:input-value="query">
            <div class="flex flex-col gap-1">
                <label :for="fruitId" class="text-sm font-medium">Fruit</label>
                <Combobox.InputGroup>
                    <Combobox.Input :id="fruitId" />
                </Combobox.InputGroup>
            </div>
            <Combobox.Portal>
                <Combobox.Positioner :side-offset="4">
                    <Combobox.Popup>
                        <Combobox.Empty>No fruit found.</Combobox.Empty>
                        <Combobox.List>
                            <Combobox.Item v-for="entry in filtered" :key="entry" :value="entry">{{ entry }}</Combobox.Item>
                        </Combobox.List>
                    </Combobox.Popup>
                </Combobox.Positioner>
            </Combobox.Portal>
        </Combobox.Root>
    </div>
    <Output :values="{ city, fruit }" />
</template>
