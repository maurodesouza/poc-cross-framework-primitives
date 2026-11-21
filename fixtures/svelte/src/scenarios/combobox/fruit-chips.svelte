<script lang="ts">
import { combobox } from "@poc/styles";
import { Combobox } from "@poc/svelte";
import type { Snippet } from "svelte";

// Chips for a `multiple` combobox: a Chip per value, with its ChipRemove, then the Input, then
// the given buttons.
let { id, children }: { id: string; children?: Snippet } = $props();
</script>

<Combobox.Chips class={combobox.chips}><Combobox.Value>{#snippet children(values: { value: string; label: string }[])}{#each values as item (item.value)}<Combobox.Chip class={combobox.chip}>{item.label}<Combobox.ChipRemove aria-label={`Remove ${item.label}`} class={combobox["chip-remove"]}>×</Combobox.ChipRemove></Combobox.Chip>{/each}<Combobox.Input {id} class={combobox.input} />{/snippet}</Combobox.Value>{@render children?.()}</Combobox.Chips>
