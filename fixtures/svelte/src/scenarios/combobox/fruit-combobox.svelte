<script lang="ts">
import { combobox } from "@poc/styles";
import { type ChangeDetails, Combobox } from "@poc/svelte";
import FruitPopup from "./fruit-popup.svelte";
import { FRUITS, type Fruit } from "./fruits.ts";

// The combobox of `/combobox/basic` (spec/combobox.md).
let {
    value = $bindable(),
    inputValue = $bindable(),
    open = $bindable(),
    onInputValueChange,
    onOpenChange,
}: {
    value: Fruit | null;
    inputValue: string;
    open: boolean;
    onInputValueChange?: (inputValue: string, details: ChangeDetails) => void;
    onOpenChange?: (open: boolean, details: ChangeDetails) => void;
} = $props();
const id = $props.id();
</script>

<Combobox.Root items={FRUITS} bind:value bind:inputValue bind:open {onInputValueChange} {onOpenChange}><div class="flex flex-col gap-1"><label for={id} class="text-sm font-medium">Fruit</label><Combobox.InputGroup class={combobox["input-group"]}><Combobox.Input {id} class={combobox.input} /><Combobox.Clear aria-label="Clear fruit" class={combobox.clear}>×</Combobox.Clear><Combobox.Trigger aria-label="Show fruits" class={combobox.trigger}>▾</Combobox.Trigger></Combobox.InputGroup></div><FruitPopup /></Combobox.Root>
