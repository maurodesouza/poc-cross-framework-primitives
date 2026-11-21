<script lang="ts">
import { combobox } from "@poc/styles";
import { Combobox } from "@poc/svelte";
import Output from "../../kit/output.svelte";
import { PRODUCE, type Produce, type ProduceGroup } from "./combobox-items.ts";
import { printValues } from "./fruits.ts";

// Grouped items, filtered across the groups (spec/combobox.md).
const id = $props.id();
let value = $state<Produce | null>(null);
</script>

<Combobox.Root items={PRODUCE} bind:value><div class="flex flex-col gap-1"><label for={id} class="text-sm font-medium">Produce</label><Combobox.InputGroup class={combobox["input-group"]}><Combobox.Input {id} class={combobox.input} /></Combobox.InputGroup></div><Combobox.Portal><Combobox.Positioner sideOffset={4} class={combobox.positioner}><Combobox.Popup class={combobox.popup}><Combobox.Empty class={combobox.empty}>Nothing found.</Combobox.Empty><Combobox.List class={combobox.list}>{#snippet children(group: ProduceGroup, index: number)}{#if index > 0}<Combobox.Separator class={combobox.separator} />{/if}<Combobox.Group class={combobox.group}><Combobox.GroupLabel class={combobox["group-label"]}>{group.label}</Combobox.GroupLabel>{#each group.items as item (item.value)}<Combobox.Item value={item} class={combobox.item}>{item.label}</Combobox.Item>{/each}</Combobox.Group>{/snippet}</Combobox.List></Combobox.Popup></Combobox.Positioner></Combobox.Portal></Combobox.Root><Output values={{ value: printValues(value) }} />
