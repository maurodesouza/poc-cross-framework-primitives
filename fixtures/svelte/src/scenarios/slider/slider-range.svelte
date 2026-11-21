<script lang="ts">
import { slider } from "@poc/styles";
import { Slider } from "@poc/svelte";
import { formEntries } from "../../kit/form-entries.ts";
import Output from "../../kit/output.svelte";

const LABELS = ["Minimum price", "Maximum price"];
let value = $state<readonly number[]>([20, 80]);
let form = $state<string>();
const onsubmit = (event: SubmitEvent) => {
    event.preventDefault();
    form = formEntries(event.currentTarget as HTMLFormElement);
};
const valueText = (thumbValue: number) => `$${thumbValue}`;
</script>

<form class="flex flex-col items-start gap-2" {onsubmit}><Slider.Root class={slider.root} defaultValue={[20, 80]} minStepsBetweenValues={10} name="price" onValueChange={(next: number[]) => (value = next)}><Slider.Control class={slider.control} data-testid="control"><Slider.Track class={slider.track}><Slider.Indicator class={slider.indicator} />{#each LABELS as label, index (label)}<Slider.Thumb class={slider.thumb} {index} aria-label={label} getAriaValueText={valueText} />{/each}</Slider.Track></Slider.Control></Slider.Root><button type="submit">Submit</button></form><Output values={{ value: value.join(","), form }} />
