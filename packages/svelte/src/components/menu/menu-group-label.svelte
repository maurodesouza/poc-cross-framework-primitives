<script lang="ts">
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { MenuGroupContext } from "./menu-group-context.svelte.ts";

/** Names its Group. */
let {
    child,
    children,
    id: idProp,
    ...rest
}: PartProps<Record<string, never>> & { id?: string } = $props();
const group = MenuGroupContext.maybe();
const generated = `poc-group-label-${Math.random().toString(36).slice(2, 8)}`;
const id = $derived(idProp ?? generated);
$effect(() => {
    if (group) {
        group.labelId = id;
    }
    return () => {
        if (group) {
            group.labelId = undefined;
        }
    };
});
const partProps = $derived(
    mergeProps({ id, "data-menu-part": "group-label" }, rest),
);
</script>

{#if child}{@render child({ props: partProps, state: {} })}{:else}<div {...partProps}>{@render children?.()}</div>{/if}
