import { createTypeahead } from "@poc/dom";
import type { JSX } from "@solidjs/web";
import { createEffect, useContext } from "solid-js";
import {
    createOverlayRoot,
    type OverlayRootProps,
} from "../../hooks/create-overlay-root.ts";
import { createPlacement } from "../../hooks/create-positioner.ts";
import {
    MenuContext,
    type MenuContextValue,
    type SafeArea,
} from "./menu-context.ts";

export interface MenuRootProps extends OverlayRootProps {
    /** Arrow keys wrap at the ends (default `true`). */
    loop?: boolean;
    children?: JSX.Element;
}

function createMenuRoot(props: MenuRootProps, nested: boolean) {
    const owner = nested ? useContext(MenuContext) : null;
    const root = createOverlayRoot(props);
    const [placed, setPlaced] = createPlacement(() =>
        nested
            ? { side: "end", align: "start" }
            : { side: "bottom", align: "start" },
    );
    const value: MenuContextValue = {
        ...root,
        parent: owner,
        loop: () => props.loop ?? true,
        pendingHighlight: { current: null },
        typeahead: createTypeahead(),
        labels: new Map(),
        placed,
        setPlaced,
        closeAll: (reason) => {
            root.setOpen(false, reason);
            owner?.closeAll(reason);
        },
        openSubmenu: { current: null },
        safeArea: { current: null as SafeArea | null },
    };
    // a parent level knows its open submenu, so a hovered sibling can close it
    createEffect(root.open, (open) => {
        if (owner === null || !open) {
            return undefined;
        }
        owner.openSubmenu.current = value;
        return () => {
            if (owner.openSubmenu.current === value) {
                owner.openSubmenu.current = null;
            }
        };
    });
    return value;
}

/** Holds the state of one menu level; renders no element (spec/menu.md). */
export function MenuRoot(props: MenuRootProps) {
    const value = createMenuRoot(props, false);
    return <MenuContext value={value}>{props.children}</MenuContext>;
}

/** A nested menu level; its trigger is a `SubmenuTrigger` item of the parent menu. */
export function MenuSubmenuRoot(props: MenuRootProps) {
    const value = createMenuRoot(props, true);
    return <MenuContext value={value}>{props.children}</MenuContext>;
}
