<script lang="ts">
import Output from "../../kit/output.svelte";
import FruitCombobox from "./fruit-combobox.svelte";
import { FRUITS, type Fruit, printValues } from "./fruits.ts";

let value = $state<Fruit | null>(
    FRUITS.find((fruit) => fruit.value === "mango") ?? null,
);
let input = $state("Mango");
let open = $state(false);
const reset = () => {
    value = null;
    input = "";
};
</script>

<FruitCombobox bind:value bind:inputValue={input} bind:open /><button type="button" class="mt-2" onclick={reset}>Reset</button><Output values={{ value: printValues(value), input, open }} />
