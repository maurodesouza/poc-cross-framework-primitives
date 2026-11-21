<script lang="ts">
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { PopoverContext } from "./popover-context.svelte.ts";

let {
    child,
    children,
    id: idProp,
    ...rest
}: PartProps<Record<string, never>> & { id?: string } = $props();
const context = PopoverContext.use("Popover.Title");
const id = $derived(idProp ?? `${context.popupId}-title`);
$effect(() => {
    context.titleId = id;
    return () => {
        context.titleId = undefined;
    };
});
const partProps = $derived(
    mergeProps({ id, "data-popover-part": "title" }, rest),
);
</script>

{#if child}{@render child({ props: partProps, state: {} })}{:else}<h2 {...partProps}>{@render children?.()}</h2>{/if}
