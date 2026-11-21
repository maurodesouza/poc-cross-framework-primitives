<script lang="ts">
import { slider } from "@poc/styles";
import { Slider } from "@poc/svelte";
import Output from "../../kit/output.svelte";

// The consumer refuses any value above 80: the slider stays.
let value = $state(70);
let requested = $state<number>();
</script>

<Slider.Root class={slider.root} bind:value={() => value, (next) => { if ((next as number) <= 80) value = next as number; }} onValueChange={(next: number) => (requested = next)}><Slider.Control class={slider.control} data-testid="control"><Slider.Track class={slider.track}><Slider.Indicator class={slider.indicator} /><Slider.Thumb class={slider.thumb} aria-label="Limited" /></Slider.Track></Slider.Control></Slider.Root><Output values={{ value, requested }} />
