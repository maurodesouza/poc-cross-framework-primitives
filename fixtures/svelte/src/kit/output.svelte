<script lang="ts">
// What a scenario prints outside the component, as `key: value` lines (spec/README.md).
let {
    values,
}: { values: Record<string, string | number | boolean | null | undefined> } =
    $props();
const text = $derived(
    Object.entries(values)
        .map(([key, value]) => `${key}: ${value ?? "none"}`)
        .join("\n"),
);
</script>

<pre data-testid="output" class="mt-4 rounded-md bg-palette-soft p-2 text-xs">{text}</pre>
