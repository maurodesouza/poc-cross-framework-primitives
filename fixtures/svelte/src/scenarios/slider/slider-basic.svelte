<script lang="ts">
import { slider } from "@poc/styles";
import { Slider } from "@poc/svelte";
import { formEntries } from "../../kit/form-entries.ts";
import Output from "../../kit/output.svelte";

// Also `/slider/rtl` (the page sets `dir`).
let value = $state<number>();
let committed = $state<number>();
let form = $state<string>();
const onsubmit = (event: SubmitEvent) => {
    event.preventDefault();
    form = formEntries(event.currentTarget as HTMLFormElement);
};
</script>

<form class="flex flex-col items-start gap-2" {onsubmit}><Slider.Root class={slider.root} defaultValue={50} name="volume" onValueChange={(next: number) => (value = next)} onValueCommit={(next: number) => (committed = next)}><Slider.Control class={slider.control} data-testid="control"><Slider.Track class={slider.track}><Slider.Indicator class={slider.indicator} /><Slider.Thumb class={slider.thumb} aria-label="Volume" /></Slider.Track></Slider.Control></Slider.Root><button type="submit">Submit</button></form><Output values={{ value, committed, form }} />
