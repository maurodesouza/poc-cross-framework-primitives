<script lang="ts">
import { type Snippet, untrack } from "svelte";
import type { ChangeDetails } from "../../utils/change-details.ts";
import { PopoverContext, PopoverState } from "./popover-context.svelte.ts";

/** Holds the popover's state (`bind:open`); renders no element (spec/popover.md). */
let {
    open = $bindable(),
    defaultOpen = false,
    onOpenChange,
    children,
}: {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean, details: ChangeDetails) => void;
    children?: Snippet;
} = $props();

PopoverContext.provide(
    new PopoverState({
        read: () => open,
        write: (next) => (open = next),
        initial: untrack(() => defaultOpen),
        onOpenChange: () => onOpenChange,
    }),
);
</script>

{@render children?.()}
