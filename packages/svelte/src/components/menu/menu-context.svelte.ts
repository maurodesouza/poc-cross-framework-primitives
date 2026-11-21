import { createTypeahead } from "@poc/dom";
import type { ChangeDetails } from "../../utils/change-details.ts";
import { createContext } from "../../utils/context.ts";
import { OverlayRoot } from "../../utils/overlay-root.svelte.ts";

/** Where the pointer left an open submenu's trigger, for the safe hover area (spec/menu.md). */
export interface SafeArea {
    x: number;
    y: number;
    submenu: HTMLElement;
}

export class MenuState extends OverlayRoot {
    readonly parent: MenuState | null;
    readonly loop: () => boolean;
    readonly pendingHighlight: { current: "first" | "last" | null } = {
        current: null,
    };
    readonly typeahead = createTypeahead();
    readonly labels = new Map<Element, string>();
    readonly openSubmenu: { current: MenuState | null } = { current: null };
    readonly safeArea: { current: SafeArea | null } = { current: null };

    constructor(options: {
        read: () => boolean | undefined;
        write: (open: boolean) => void;
        initial: boolean;
        onOpenChange: () =>
            | ((open: boolean, details: ChangeDetails) => void)
            | undefined;
        parent: MenuState | null;
        loop: () => boolean;
    }) {
        super({
            ...options,
            placed: options.parent
                ? { side: "end", align: "start" }
                : { side: "bottom", align: "start" },
        });
        this.parent = options.parent;
        this.loop = options.loop;
    }

    /** Closes this level and every level above it. */
    closeAll(reason: "item-press" | "focus-out" | "outside-press"): void {
        this.setOpen(false, reason);
        this.parent?.closeAll(reason);
    }
}

export const MenuContext = createContext<MenuState>("Menu");
