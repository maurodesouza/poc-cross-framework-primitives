import type { Align, createTypeahead, Side } from "@poc/dom";
import { createContext, type MutableRefObject } from "react";
import type { OverlayRoot } from "../../hooks/use-overlay-root.ts";

/** Where the pointer left an open submenu's trigger, for the safe hover area (spec/menu.md). */
export interface SafeArea {
    x: number;
    y: number;
    submenu: HTMLElement;
}

export interface MenuContextValue extends OverlayRoot {
    /** The menu this one is a submenu of. */
    parent: MenuContextValue | null;
    loop: boolean;
    /** The item to highlight when the popup opens: from the keyboard, the first or the last. */
    pendingHighlight: MutableRefObject<"first" | "last" | null>;
    typeahead: ReturnType<typeof createTypeahead>;
    /** Labels given with the `label` prop, by item element. */
    labels: Map<Element, string>;
    placed: { side: Side; align: Align };
    setPlaced: (placed: { side: Side; align: Align }) => void;
    /** Closes this level and every level above it. */
    closeAll: (reason: "item-press" | "focus-out" | "outside-press") => void;
    /** The open submenu of this level, so hovering a sibling item can close it. */
    openSubmenu: MutableRefObject<MenuContextValue | null>;
    safeArea: MutableRefObject<SafeArea | null>;
}

export const MenuContext = createContext<MenuContextValue | null>(null);
