<script lang="ts">
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";

/** Between groups; no role of its own (a `listbox` owns only groups and options). */
let { child, children, ...rest }: PartProps<Record<string, never>> = $props();
const partProps = $derived(
    mergeProps(
        {
            role: "presentation",
            "data-orientation": "horizontal",
            "data-combobox-part": "separator",
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: {} })}{:else}<div {...partProps}>{@render children?.()}</div>{/if}
