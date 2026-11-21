<script lang="ts">
import { combobox } from "@poc/styles";
import { Combobox } from "@poc/svelte";
import Output from "../../kit/output.svelte";
import { CITIES } from "./combobox-items.ts";
import { FRUITS } from "./fruits.ts";

// The default filter with a limit, and a list the consumer filters (spec/combobox.md).
const FRUIT_LABELS = FRUITS.map((fruit) => fruit.label);
const uid = $props.id();
const cityId = `${uid}-city`;
const fruitId = `${uid}-fruit`;
let city = $state<string | null>(null);
let fruit = $state<string | null>(null);
let query = $state("");
const filtered = $derived(
    FRUIT_LABELS.filter((label) =>
        label.toLowerCase().startsWith(query.trim().toLowerCase()),
    ),
);
</script>

<div class="flex flex-col gap-4"><Combobox.Root items={CITIES} limit={4} bind:value={city}><div class="flex flex-col gap-1"><label for={cityId} class="text-sm font-medium">City</label><Combobox.InputGroup class={combobox["input-group"]}><Combobox.Input id={cityId} class={combobox.input} /></Combobox.InputGroup></div><Combobox.Portal><Combobox.Positioner sideOffset={4} class={combobox.positioner}><Combobox.Popup class={combobox.popup}><Combobox.Empty class={combobox.empty}>No city found.</Combobox.Empty><Combobox.List class={combobox.list}>{#snippet children(entry: string)}<Combobox.Item value={entry} class={combobox.item}>{entry}</Combobox.Item>{/snippet}</Combobox.List></Combobox.Popup></Combobox.Positioner></Combobox.Portal></Combobox.Root><Combobox.Root bind:value={fruit} bind:inputValue={query}><div class="flex flex-col gap-1"><label for={fruitId} class="text-sm font-medium">Fruit</label><Combobox.InputGroup class={combobox["input-group"]}><Combobox.Input id={fruitId} class={combobox.input} /></Combobox.InputGroup></div><Combobox.Portal><Combobox.Positioner sideOffset={4} class={combobox.positioner}><Combobox.Popup class={combobox.popup}><Combobox.Empty class={combobox.empty}>No fruit found.</Combobox.Empty><Combobox.List class={combobox.list}>{#each filtered as entry (entry)}<Combobox.Item value={entry} class={combobox.item}>{entry}</Combobox.Item>{/each}</Combobox.List></Combobox.Popup></Combobox.Positioner></Combobox.Portal></Combobox.Root></div><Output values={{ city, fruit }} />
