<script lang="ts">
import Output from "../../kit/output.svelte";
import FruitSelect from "./fruit-select.svelte";

// The consumer refuses Cherry: the value stays.
let value = $state<string | null>("apple");
let requested = $state<string | null>();
</script>

<div class="flex flex-col items-start gap-2"><label for="fruit" class="text-sm font-medium">Fruit</label><FruitSelect id="fruit" bind:value={() => value, (next) => { if (next !== "cherry") value = next ?? null; }} onValueChange={(next) => (requested = next)} /></div><Output values={{ value, requested }} />
