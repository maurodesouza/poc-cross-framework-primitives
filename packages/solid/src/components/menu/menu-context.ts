import type { createTypeahead } from "@poc/dom";
import { createContext, useContext } from "solid-js";
import type { OverlayRoot } from "../../hooks/create-overlay-root.ts";
import type { Placement } from "../../hooks/create-positioner.ts";

/** Where the pointer left an open submenu's trigger, for the safe hover area (spec/menu.md). */
export interface SafeArea {
    x: number;
    y: number;
    submenu: HTMLElement;
}

export interface MenuContextValue extends OverlayRoot {
    /** The menu this one is a submenu of. */
    parent: MenuContextValue | null;
    loop: () => boolean;
    /** The item to highlight when the popup opens: from the keyboard, the first or the last. */
    pendingHighlight: { current: "first" | "last" | null };
    typeahead: ReturnType<typeof createTypeahead>;
    /** Labels given with the `label` prop, by item element. */
    labels: Map<Element, string>;
    placed: () => Placement;
    setPlaced: (placed: Placement) => void;
    /** Closes this level and every level above it. */
    closeAll: (reason: "item-press" | "focus-out" | "outside-press") => void;
    /** The open submenu of this level, so hovering a sibling item can close it. */
    openSubmenu: { current: MenuContextValue | null };
    safeArea: { current: SafeArea | null };
}

/** `null` outside any menu: a root menu has no parent level. */
export const MenuContext = createContext<MenuContextValue | null>(null);

/** The nearest menu level (its context is optional, so a missing Root throws here). */
export function useMenuContext(part: string): MenuContextValue {
    const context = useContext(MenuContext);
    if (context === null) {
        throw new Error(`<${part}> must be inside <Menu.Root>.`);
    }
    return context;
}
