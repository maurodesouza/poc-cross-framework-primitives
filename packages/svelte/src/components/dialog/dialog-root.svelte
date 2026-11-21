<script lang="ts">
import { type Snippet, untrack } from "svelte";
import type { ChangeDetails } from "../../utils/change-details.ts";
import { DialogContext, DialogState } from "./dialog-context.svelte.ts";

/** Holds the dialog's state (`bind:open`); renders no element (spec/dialog.md). */
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

DialogContext.provide(
    new DialogState({
        read: () => open,
        write: (next) => (open = next),
        initial: untrack(() => defaultOpen),
        onOpenChange: () => onOpenChange,
    }),
);
</script>

{@render children?.()}
