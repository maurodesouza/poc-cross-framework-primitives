<script lang="ts">
import { checkbox } from "@poc/styles";
import { Checkbox } from "@poc/svelte";

// The styled checkbox, with its indicator: a check, or a dash while mixed.
let {
    checked = $bindable(),
    ...props
}: Record<string, unknown> & {
    checked?: boolean;
} = $props();
</script>

<Checkbox.Root class={checkbox.root} bind:checked {...props}><Checkbox.Indicator class={checkbox.indicator}>{#snippet child({ props: indicatorProps, state })}<span {...indicatorProps}>{state.indeterminate ? "–" : "✓"}</span>{/snippet}</Checkbox.Indicator></Checkbox.Root>
