<script lang="ts">
import { createDelayGroup, trackHoverBridge } from "@poc/dom";
import { onDestroy, type Snippet, untrack } from "svelte";
import type { ChangeDetails } from "../../utils/change-details.ts";
import {
    TooltipContext,
    TooltipProviderContext,
    TooltipState,
} from "./tooltip-context.svelte.ts";

/** Holds the tooltip's state (`bind:open`) and its hover intent; renders no element (spec/tooltip.md). */
let {
    open = $bindable(),
    defaultOpen = false,
    onOpenChange,
    delay,
    closeDelay,
    disabled = false,
    children,
}: {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean, details: ChangeDetails) => void;
    /** ms before a hovered trigger opens (default: the Provider's, else 600). */
    delay?: number;
    /** ms before it closes once the pointer left (default: the Provider's, else 0). */
    closeDelay?: number;
    disabled?: boolean;
    children?: Snippet;
} = $props();

const provider = TooltipProviderContext.maybe();
// a Root outside any Provider is alone in its own group
const ownGroup = createDelayGroup({ timeout: 0 });
const group = () => provider?.group ?? ownGroup;
const tooltip = new TooltipState(
    {
        read: () => open,
        write: (next) => (open = next),
        initial: untrack(() => defaultOpen),
        onOpenChange: () => onOpenChange,
    },
    {
        delay: () => delay ?? provider?.delay ?? 600,
        closeDelay: () => closeDelay ?? provider?.closeDelay ?? 0,
        disabled: () => disabled,
        group,
    },
);
TooltipContext.provide(tooltip);
onDestroy(() => tooltip.intent.cancel());

// one open tooltip per group: the previous one closes when this one opens
const member = () => tooltip.hide("trigger-hover");
$effect(() => {
    if (!tooltip.open) {
        return undefined;
    }
    const current = untrack(group);
    untrack(() => current.opened(member));
    return () => current.closed(member);
});

// a hover-opened tooltip closes once the pointer leaves the trigger, the popup and the gap
$effect(() => {
    const trigger = tooltip.trigger;
    const popup = tooltip.popup;
    if (!tooltip.open || !tooltip.openedByHover || trigger === null) {
        return undefined;
    }
    return trackHoverBridge(trigger, popup, {
        inside: () => tooltip.intent.cancel(),
        outside: () => tooltip.intent.leave(tooltip.options.closeDelay()),
    });
});

// Escape closes it and stops there
$effect(() => {
    const trigger = tooltip.trigger;
    if (!tooltip.open || trigger === null) {
        return undefined;
    }
    const doc = trigger.ownerDocument;
    const onKeydown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            event.stopPropagation();
            tooltip.intent.cancel();
            tooltip.hide("escape-key");
        }
    };
    doc.addEventListener("keydown", onKeydown, true);
    return () => doc.removeEventListener("keydown", onKeydown, true);
});
</script>

{@render children?.()}
