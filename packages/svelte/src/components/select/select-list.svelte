<script lang="ts">
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { SelectContext } from "./select-context.svelte.ts";

/** The `listbox`, named by the trigger's labels (spec/select.md). */
let { child, children, ...rest }: PartProps<{ open: boolean }> = $props();
const context = SelectContext.use("Select.List");
const partState = $derived({ open: context.open });
const partProps = $derived(
    mergeProps(
        {
            role: "listbox",
            id: context.listId,
            "aria-labelledby": context.trigger?.id,
            "data-select-part": "list",
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<div {...partProps}>{@render children?.()}</div>{/if}
