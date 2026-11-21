<script lang="ts">
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { ComboboxGroupContext } from "./combobox-context.svelte.ts";

/** A `group` of items, named by its GroupLabel (spec/combobox.md). */
let { child, children, ...rest }: PartProps<Record<string, never>> = $props();
const id = $props.id();
const labelId = `${id}-label`;
ComboboxGroupContext.provide({ labelId });
const partProps = $derived(
    mergeProps(
        {
            role: "group",
            "aria-labelledby": labelId,
            "data-combobox-part": "group",
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: {} })}{:else}<div {...partProps}>{@render children?.()}</div>{/if}
