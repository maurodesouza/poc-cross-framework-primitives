<script lang="ts">
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";

let { child, children, ...rest }: PartProps<Record<string, never>> = $props();
const partProps = $derived(
    mergeProps(
        {
            role: "separator",
            "aria-orientation": "horizontal",
            "data-menu-part": "separator",
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: {} })}{:else}<div {...partProps}>{@render children?.()}</div>{/if}
