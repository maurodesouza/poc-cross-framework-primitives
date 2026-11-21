<script lang="ts">
import { field, slider } from "@poc/styles";
import { Field, Slider } from "@poc/svelte";
import { formEntries } from "../../kit/form-entries.ts";
import Output from "../../kit/output.svelte";
import StyledCheckbox from "../checkbox/styled-checkbox.svelte";
import FruitSelect from "../select/fruit-select.svelte";

let form = $state<string>();
const onsubmit = (event: SubmitEvent) => {
    event.preventDefault();
    form = formEntries(event.currentTarget as HTMLFormElement);
};
</script>

<form class="flex flex-col items-start gap-4" {onsubmit}><Field.Root name="terms" class={field.root}><div class="flex items-center gap-2"><StyledCheckbox required /><Field.Label class={field.label}>Accept terms</Field.Label></div><Field.Description class={field.description}>Required to continue.</Field.Description><Field.Error class={field.error}>You must accept the terms.</Field.Error></Field.Root><Field.Root name="fruit" class={field.root}><Field.Label class={field.label}>Fruit</Field.Label><FruitSelect required /><Field.Description class={field.description}>Pick one.</Field.Description><Field.Error class={field.error}>Choose a fruit.</Field.Error></Field.Root><Field.Root name="volume" class={field.root}><Field.Label class={field.label}>Volume</Field.Label><Slider.Root class={slider.root} defaultValue={50}><Slider.Control class={slider.control}><Slider.Track class={slider.track}><Slider.Indicator class={slider.indicator} /><Slider.Thumb class={slider.thumb} /></Slider.Track></Slider.Control></Slider.Root><Field.Description class={field.description}>From 0 to 100.</Field.Description></Field.Root><button type="submit">Submit</button></form><Output values={{ form }} />
