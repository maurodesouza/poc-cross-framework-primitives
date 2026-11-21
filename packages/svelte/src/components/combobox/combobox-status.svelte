<script lang="ts">
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";

/** A polite live region for the consumer's text (spec/combobox.md). */
let { child, children, ...rest }: PartProps<Record<string, never>> = $props();
const partProps = $derived(
    mergeProps(
        {
            role: "status",
            "aria-live": "polite",
            "aria-atomic": "true",
            "data-combobox-part": "status",
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: {} })}{:else}<div {...partProps}>{@render children?.()}</div>{/if}
