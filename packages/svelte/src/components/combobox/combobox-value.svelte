<script lang="ts">
import type { Snippet } from "svelte";
import { ComboboxContext } from "./combobox-context.svelte.ts";

/**
 * Renders the value: its label (labels joined with ", "), or the consumer's `children` snippet of
 * it (`{#snippet children(value)}`: an item or `null`, or the list of items).
 */
let {
    children,
}: {
    // biome-ignore lint/suspicious/noExplicitAny: the value is the consumer's own item type
    children?: Snippet<[value: any]>;
} = $props();
const context = ComboboxContext.use("Combobox.Value");
</script>

{#if children}{@render children(context.value)}{:else}{context.values.map((item) => context.label(item)).join(", ")}{/if}
