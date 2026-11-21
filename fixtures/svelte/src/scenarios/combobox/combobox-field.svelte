<script lang="ts">
import { combobox, field } from "@poc/styles";
import { Combobox, Field } from "@poc/svelte";
import { formEntries } from "../../kit/form-entries.ts";
import Output from "../../kit/output.svelte";
import FruitPopup from "./fruit-popup.svelte";
import { FRUITS } from "./fruits.ts";

// The combobox inside a Field: labelled, described and validated by it (spec/combobox.md).
let form = $state<string>();
const onsubmit = (event: SubmitEvent) => {
    event.preventDefault();
    form = formEntries(event.currentTarget as HTMLFormElement);
};
</script>

<form class="flex flex-col items-start gap-4" {onsubmit}><Field.Root name="fruit" class={field.root}><Field.Label class={field.label}>Fruit</Field.Label><Combobox.Root items={FRUITS} required><Combobox.InputGroup class={combobox["input-group"]}><Combobox.Input class={combobox.input} /><Combobox.Clear aria-label="Clear fruit" class={combobox.clear}>×</Combobox.Clear><Combobox.Trigger aria-label="Show fruits" class={combobox.trigger}>▾</Combobox.Trigger></Combobox.InputGroup><FruitPopup /></Combobox.Root><Field.Description class={field.description}>Pick one.</Field.Description><Field.Error class={field.error}>Choose a fruit.</Field.Error></Field.Root><button type="submit">Submit</button></form><Output values={{ form }} />
