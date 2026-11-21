<script lang="ts">
import { createDelayGroup } from "@poc/dom";
import type { Snippet } from "svelte";
import { TooltipProviderContext } from "./tooltip-context.svelte.ts";

/** A delay group: shared delays and the instant hand-off (spec/tooltip.md); renders no element. */
let {
    delay = 600,
    closeDelay = 0,
    timeout = 400,
    children,
}: {
    /** ms before a hovered trigger opens its tooltip. */
    delay?: number;
    /** ms before a tooltip closes once the pointer left. */
    closeDelay?: number;
    /** ms after a close during which another tooltip of the group opens at once. */
    timeout?: number;
    children?: Snippet;
} = $props();
const group = $derived(createDelayGroup({ timeout }));
TooltipProviderContext.provide({
    get delay() {
        return delay;
    },
    get closeDelay() {
        return closeDelay;
    },
    get group() {
        return group;
    },
});
</script>

{@render children?.()}
