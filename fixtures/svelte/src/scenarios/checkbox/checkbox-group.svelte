<script lang="ts">
import { checkboxGroup } from "@poc/styles";
import { CheckboxGroup } from "@poc/svelte";
import { formEntries } from "../../kit/form-entries.ts";
import Output from "../../kit/output.svelte";
import StyledCheckbox from "./styled-checkbox.svelte";

const TOPPINGS = [
    { value: "cheese", label: "Cheese" },
    { value: "ham", label: "Ham" },
    { value: "pineapple", label: "Pineapple" },
];
const allValues = TOPPINGS.map((topping) => topping.value);
let value = $state<string[]>(["cheese"]);
let form = $state<string>();
const onsubmit = (event: SubmitEvent) => {
    event.preventDefault();
    form = formEntries(event.currentTarget as HTMLFormElement);
};
</script>

<form class="flex flex-col items-start gap-2" {onsubmit}><h2 id="toppings" class="text-sm font-semibold">Toppings</h2><CheckboxGroup aria-labelledby="toppings" class={checkboxGroup.root} bind:value {allValues}><label class="flex items-center gap-2 text-sm"><StyledCheckbox parent />All toppings</label>{#each TOPPINGS as topping (topping.value)}<label class="flex items-center gap-2 text-sm"><StyledCheckbox name="toppings" value={topping.value} />{topping.label}</label>{/each}</CheckboxGroup><button type="submit">Submit</button></form><Output values={{ value: value.join(",") || undefined, form }} />
