<script lang="ts">
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import {
    MenuGroupContext,
    MenuGroupState,
} from "./menu-group-context.svelte.ts";

/** Groups items under its GroupLabel. */
let { child, children, ...rest }: PartProps<Record<string, never>> = $props();
const group = new MenuGroupState();
MenuGroupContext.provide(group);
const partProps = $derived(
    mergeProps(
        {
            role: "group",
            "aria-labelledby": group.labelId,
            "data-menu-part": "group",
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: {} })}{:else}<div {...partProps}>{@render children?.()}</div>{/if}
