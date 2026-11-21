<script lang="ts">
import { combobox } from "@poc/styles";
import { Combobox } from "@poc/svelte";
import Output from "../../kit/output.svelte";
import { COUNTRIES, type Country, matchCountry } from "./combobox-items.ts";

// Object values, compared, named and serialized by the consumer (spec/combobox.md).
const id = $props.id();
let value = $state<Country | null>({ code: "BR", name: "Brazil" });
let input = $state("Brazil");
</script>

<Combobox.Root items={COUNTRIES} itemToStringLabel={(country: Country) => country.name} itemToStringValue={(country: Country) => country.code} isItemEqualToValue={(item: Country, selected: Country) => item.code === selected.code} filter={(item: Country, query: string) => matchCountry(item, query)} bind:value bind:inputValue={input}><div class="flex flex-col gap-1"><label for={id} class="text-sm font-medium">Country</label><Combobox.InputGroup class={combobox["input-group"]}><Combobox.Input {id} class={combobox.input} /></Combobox.InputGroup></div><Combobox.Portal><Combobox.Positioner sideOffset={4} class={combobox.positioner}><Combobox.Popup class={combobox.popup}><Combobox.Empty class={combobox.empty}>No country found.</Combobox.Empty><Combobox.List class={combobox.list}>{#snippet children(country: Country)}<Combobox.Item value={country} class={combobox.item}>{country.name}<Combobox.ItemIndicator class={combobox["item-indicator"]}>✓</Combobox.ItemIndicator></Combobox.Item>{/snippet}</Combobox.List></Combobox.Popup></Combobox.Positioner></Combobox.Portal></Combobox.Root><Output values={{ value: value?.code, input }} />
