<script lang="ts">
import { select } from "@poc/styles";
import { type ChangeDetails, Select } from "@poc/svelte";
import { FRUIT_ITEMS } from "./fruit-items.ts";

let {
    id,
    name,
    required,
    value = $bindable(),
    onValueChange,
    onOpenChange,
}: {
    id: string;
    name?: string;
    required?: boolean;
    value?: string | null;
    onValueChange?: (value: string | null) => void;
    onOpenChange?: (open: boolean, reason: string) => void;
} = $props();
</script>

<Select.Root items={FRUIT_ITEMS} {name} {required} bind:value onValueChange={(next: string | null) => onValueChange?.(next)} onOpenChange={(open: boolean, details: ChangeDetails) => onOpenChange?.(open, details.reason)}><Select.Trigger {id} class={select.trigger}><Select.Value placeholder="Choose a fruit" class={select.value} /></Select.Trigger><Select.Portal><Select.Positioner class={select.positioner}><Select.Popup class={select.popup}><Select.List class={select.list}>{#each FRUIT_ITEMS as item (item.value)}<Select.Item value={item.value} class={select.item}>{item.label}<Select.ItemIndicator class={select["item-indicator"]}>✓</Select.ItemIndicator></Select.Item>{/each}</Select.List></Select.Popup></Select.Positioner></Select.Portal></Select.Root>
