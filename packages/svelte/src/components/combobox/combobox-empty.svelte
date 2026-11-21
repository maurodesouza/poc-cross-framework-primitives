<script lang="ts">
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { ComboboxContext } from "./combobox-context.svelte.ts";

/**
 * A polite live region, always rendered; its children are shown only while the list is empty
 * (spec/combobox.md).
 */
let { child, children, ...rest }: PartProps<Record<string, never>> = $props();
const context = ComboboxContext.use("Combobox.Empty");
const partProps = $derived(
    mergeProps(
        {
            role: "status",
            "aria-live": "polite",
            "aria-atomic": "true",
            "data-combobox-part": "empty",
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: {} })}{:else}<div {...partProps}>{#if context.empty}{@render children?.()}{/if}</div>{/if}
