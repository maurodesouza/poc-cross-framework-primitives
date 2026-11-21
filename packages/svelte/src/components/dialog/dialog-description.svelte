<script lang="ts">
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { DialogContext } from "./dialog-context.svelte.ts";

/** Describes the dialog (its id becomes the popup's `aria-describedby`). */
let {
    child,
    children,
    id: idProp,
    ...rest
}: PartProps<Record<string, never>> & { id?: string } = $props();
const context = DialogContext.use("Dialog.Description");
const id = $derived(idProp ?? `${context.popupId}-description`);
$effect(() => {
    context.descriptionId = id;
    return () => {
        context.descriptionId = undefined;
    };
});
const partProps = $derived(
    mergeProps({ id, "data-dialog-part": "description" }, rest),
);
</script>

{#if child}{@render child({ props: partProps, state: {} })}{:else}<p {...partProps}>{@render children?.()}</p>{/if}
