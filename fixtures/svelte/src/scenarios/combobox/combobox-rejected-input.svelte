<script lang="ts">
import Output from "../../kit/output.svelte";
import FruitCombobox from "./fruit-combobox.svelte";
import { type Fruit, printValues } from "./fruits.ts";

// The consumer refuses an input value with a digit: the input keeps the consumer's value.
let value = $state<Fruit | null>(null);
let input = $state("");
let open = $state(false);
</script>

<FruitCombobox bind:value bind:inputValue={() => input, (next) => { if (!/\d/.test(next)) input = next; }} bind:open /><Output values={{ value: printValues(value), input, open }} />
