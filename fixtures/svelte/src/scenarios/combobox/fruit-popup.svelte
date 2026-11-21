<script lang="ts">
import { combobox } from "@poc/styles";
import { Combobox } from "@poc/svelte";
import type { Fruit } from "./fruits.ts";

// The fruits' popup: an Empty and the List, each Item with its label (and indicator).
let { indicator = false }: { indicator?: boolean } = $props();
</script>

<Combobox.Portal><Combobox.Positioner sideOffset={4} class={combobox.positioner}><Combobox.Popup class={combobox.popup}><Combobox.Empty class={combobox.empty}>No fruit found.</Combobox.Empty><Combobox.List class={combobox.list}>{#snippet children(fruit: Fruit)}<Combobox.Item value={fruit} disabled={fruit.disabled} class={combobox.item}>{fruit.label}{#if indicator}<Combobox.ItemIndicator class={combobox["item-indicator"]}>✓</Combobox.ItemIndicator>{/if}</Combobox.Item>{/snippet}</Combobox.List></Combobox.Popup></Combobox.Positioner></Combobox.Portal>
