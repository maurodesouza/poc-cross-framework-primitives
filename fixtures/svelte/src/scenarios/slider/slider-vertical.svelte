<script lang="ts">
import { slider } from "@poc/styles";
import { Slider } from "@poc/svelte";
import Output from "../../kit/output.svelte";

let value = $state(30);
</script>

<Slider.Root class={slider.root} defaultValue={30} orientation="vertical" onValueChange={(next: number) => (value = next)}><Slider.Control class={slider.control} data-testid="control"><Slider.Track class={slider.track}><Slider.Indicator class={slider.indicator} /><Slider.Thumb class={slider.thumb} aria-label="Brightness" /></Slider.Track></Slider.Control></Slider.Root><Output values={{ value }} />
