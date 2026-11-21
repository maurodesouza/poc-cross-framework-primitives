<script setup lang="ts">
import { ref, useId } from "vue";
import { formEntries } from "../../kit/form-entries.ts";
import Output from "../../kit/output.vue";
import { Combobox } from "../../kit/ui/combobox.ts";
import { TOPPINGS } from "./combobox-items.ts";
import FruitChips from "./fruit-chips.vue";
import FruitPopup from "./fruit-popup.vue";
import { FRUITS } from "./fruits.ts";

// A single and a multiple combobox in a native form (spec/combobox.md).
const NUTS = TOPPINGS.filter((topping) => topping.value === "nuts");
const fruitId = useId();
const toppingsId = useId();
const form = ref<string>();
const onSubmit = (event: Event) => {
    event.preventDefault();
    form.value = formEntries(event.currentTarget as HTMLFormElement);
};
</script>

<template>
    <form class="flex flex-col items-start gap-4" @submit="onSubmit">
        <Combobox.Root :items="FRUITS" name="fruit" required>
            <div class="flex flex-col gap-1">
                <label :for="fruitId" class="text-sm font-medium">Fruit</label>
                <Combobox.InputGroup>
                    <Combobox.Input :id="fruitId" />
                </Combobox.InputGroup>
            </div>
            <FruitPopup />
        </Combobox.Root>
        <Combobox.Root multiple :items="TOPPINGS" name="toppings" :default-value="NUTS">
            <div class="flex flex-col gap-1">
                <label :for="toppingsId" class="text-sm font-medium">Toppings</label>
                <FruitChips :id="toppingsId" />
            </div>
            <Combobox.Portal>
                <Combobox.Positioner :side-offset="4">
                    <Combobox.Popup>
                        <Combobox.List v-slot="{ entry: topping }">
                            <Combobox.Item :key="topping.value" :value="topping">{{ topping.label }}</Combobox.Item>
                        </Combobox.List>
                    </Combobox.Popup>
                </Combobox.Positioner>
            </Combobox.Portal>
        </Combobox.Root>
        <div class="flex gap-2">
            <button type="submit">Submit</button>
            <button type="reset">Reset</button>
        </div>
    </form>
    <Output :values="{ form }" />
</template>
