<script lang="ts">
import { type Snippet, untrack } from "svelte";
import type { ChangeDetails } from "../../utils/change-details.ts";
import { MenuContext, MenuState } from "./menu-context.svelte.ts";

/**
 * Holds the state of one menu level (`bind:open`); renders no element (spec/menu.md). With
 * `nested`, it is a submenu level: `Menu.SubmenuRoot` sets it.
 */
let {
    open = $bindable(),
    defaultOpen = false,
    onOpenChange,
    loop = true,
    nested = false,
    children,
}: {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean, details: ChangeDetails) => void;
    loop?: boolean;
    nested?: boolean;
    children?: Snippet;
} = $props();

const parent = untrack(() => nested) ? (MenuContext.maybe() ?? null) : null;
const state = new MenuState({
    read: () => open,
    write: (next) => (open = next),
    initial: untrack(() => defaultOpen),
    onOpenChange: () => onOpenChange,
    parent,
    loop: () => loop,
});
// a parent level knows its open submenu, so a hovered sibling can close it
$effect(() => {
    if (parent === null || !state.open) {
        return undefined;
    }
    parent.openSubmenu.current = state;
    return () => {
        if (parent.openSubmenu.current === state) {
            parent.openSubmenu.current = null;
        }
    };
});
MenuContext.provide(state);
</script>

{@render children?.()}
