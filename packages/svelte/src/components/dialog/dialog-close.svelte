<script lang="ts">
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { DialogContext } from "./dialog-context.svelte.ts";

/** Closes the dialog (reason `close-press`). */
let { child, children, ...rest }: PartProps<Record<string, never>> = $props();
const context = DialogContext.use("Dialog.Close");
const partProps = $derived(
    mergeProps(
        {
            type: "button",
            "data-dialog-part": "close",
            onclick: () => context.setOpen(false, "close-press"),
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: {} })}{:else}<button {...partProps}>{@render children?.()}</button>{/if}
