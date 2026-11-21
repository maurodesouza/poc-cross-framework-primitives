<script lang="ts">
import { combobox } from "@poc/styles";
import { Combobox } from "@poc/svelte";
import { formEntries } from "../../kit/form-entries.ts";
import Output from "../../kit/output.svelte";
import { type Produce, TOPPINGS } from "./combobox-items.ts";
import FruitChips from "./fruit-chips.svelte";
import FruitPopup from "./fruit-popup.svelte";
import { FRUITS } from "./fruits.ts";

// A single and a multiple combobox in a native form (spec/combobox.md).
const NUTS = TOPPINGS.filter((topping) => topping.value === "nuts");
const uid = $props.id();
const fruitId = `${uid}-fruit`;
const toppingsId = `${uid}-toppings`;
let form = $state<string>();
const onsubmit = (event: SubmitEvent) => {
    event.preventDefault();
    form = formEntries(event.currentTarget as HTMLFormElement);
};
</script>

<form class="flex flex-col items-start gap-4" {onsubmit}><Combobox.Root items={FRUITS} name="fruit" required><div class="flex flex-col gap-1"><label for={fruitId} class="text-sm font-medium">Fruit</label><Combobox.InputGroup class={combobox["input-group"]}><Combobox.Input id={fruitId} class={combobox.input} /></Combobox.InputGroup></div><FruitPopup /></Combobox.Root><Combobox.Root multiple items={TOPPINGS} name="toppings" defaultValue={NUTS}><div class="flex flex-col gap-1"><label for={toppingsId} class="text-sm font-medium">Toppings</label><FruitChips id={toppingsId} /></div><Combobox.Portal><Combobox.Positioner sideOffset={4} class={combobox.positioner}><Combobox.Popup class={combobox.popup}><Combobox.List class={combobox.list}>{#snippet children(topping: Produce)}<Combobox.Item value={topping} class={combobox.item}>{topping.label}</Combobox.Item>{/snippet}</Combobox.List></Combobox.Popup></Combobox.Positioner></Combobox.Portal></Combobox.Root><div class="flex gap-2"><button type="submit">Submit</button><button type="reset">Reset</button></div></form><Output values={{ form }} />
