<script lang="ts">
import { combobox } from "@poc/styles";
import { type ChangeDetails, Combobox } from "@poc/svelte";
import { filterFruits } from "./fruits.ts";

let {
    value = $bindable(),
    inputValue = $bindable(),
    open = $bindable(),
    onOpenChange,
}: {
    value: string | null;
    inputValue: string;
    open: boolean;
    onOpenChange?: (open: boolean, details: ChangeDetails) => void;
} = $props();
const id = "fruit-input";
const filtered = $derived(filterFruits(inputValue));
</script>

<Combobox.Root bind:value bind:inputValue bind:open {onOpenChange}><div class="flex flex-col gap-1"><label for={id} class="text-sm font-medium">Fruit</label><div class="flex items-center gap-1"><Combobox.Input {id} class={combobox.input} /><Combobox.Trigger aria-label="Show fruits" class={combobox.trigger}>▾</Combobox.Trigger></div></div><Combobox.Portal><Combobox.Positioner sideOffset={4} class={combobox.positioner}><Combobox.Popup class={combobox.popup}>{#if filtered.length === 0}<Combobox.Empty class={combobox.empty}>No fruit found.</Combobox.Empty>{/if}<Combobox.List class={combobox.list}>{#each filtered as fruit (fruit.value)}<Combobox.Item value={fruit.value} disabled={fruit.disabled} class={combobox.item}>{fruit.label}</Combobox.Item>{/each}</Combobox.List></Combobox.Popup></Combobox.Positioner></Combobox.Portal></Combobox.Root>
