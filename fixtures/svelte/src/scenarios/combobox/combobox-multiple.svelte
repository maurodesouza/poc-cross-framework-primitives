<script lang="ts">
import { combobox } from "@poc/styles";
import { Combobox } from "@poc/svelte";
import Output from "../../kit/output.svelte";
import FruitChips from "./fruit-chips.svelte";
import FruitPopup from "./fruit-popup.svelte";
import { FRUITS, type Fruit, printValues } from "./fruits.ts";

// `multiple`, with chips, a Clear and a Status (spec/combobox.md).
const DEFAULT = FRUITS.filter(
    (fruit) => fruit.value === "apple" || fruit.value === "cherry",
);
const id = $props.id();
// a deep `$state`: its items are proxies of the fruits, equal to them by the default equality
let value = $state<Fruit[]>(DEFAULT);
</script>

<Combobox.Root multiple items={FRUITS} bind:value><div class="flex flex-col gap-1"><label for={id} class="text-sm font-medium">Fruits</label><FruitChips {id}><Combobox.Clear aria-label="Clear fruits" class={combobox.clear}>×</Combobox.Clear><Combobox.Trigger aria-label="Show fruits" class={combobox.trigger}>▾</Combobox.Trigger></FruitChips></div><Combobox.Status class={combobox.status}>{value.length === 1 ? "1 fruit selected." : `${value.length} fruits selected.`}</Combobox.Status><FruitPopup indicator /></Combobox.Root><Output values={{ value: printValues(value) }} />
