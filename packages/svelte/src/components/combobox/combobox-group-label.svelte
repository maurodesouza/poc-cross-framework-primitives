<script lang="ts">
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { ComboboxGroupContext } from "./combobox-context.svelte.ts";

/** Names its Group. */
let { child, children, ...rest }: PartProps<Record<string, never>> = $props();
const group = ComboboxGroupContext.use("Combobox.GroupLabel");
const partProps = $derived(
    mergeProps(
        { id: group.labelId, "data-combobox-part": "group-label" },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: {} })}{:else}<div {...partProps}>{@render children?.()}</div>{/if}
