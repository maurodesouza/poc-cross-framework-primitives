<script lang="ts">
import type { ChangeDetails } from "@poc/svelte";
import Output from "../../kit/output.svelte";
import FruitCombobox from "./fruit-combobox.svelte";
import { type Fruit, printValues } from "./fruits.ts";

// the value is kept in a deep `$state`: the combobox gets the proxy back through the binding
let value = $state<Fruit | null>(null);
let input = $state("");
let open = $state(false);
let reason = $state<string>();
</script>

<FruitCombobox bind:value bind:inputValue={input} bind:open onOpenChange={(_: boolean, details: ChangeDetails) => (reason = details.reason)} /><Output values={{ value: printValues(value), input, open, reason }} />
