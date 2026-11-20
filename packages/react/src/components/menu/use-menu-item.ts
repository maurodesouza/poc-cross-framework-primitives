import { isInSafeArea } from "@poc/dom";
import { type PointerEvent, useLayoutEffect, useState } from "react";
import type { MenuContextValue } from "./menu-context.ts";
import { menuItems } from "./menu-items.ts";

/**
 * What every item of a menu level shares: highlight follows focus, the pointer highlights, the
 * typeahead label, and the safe area that protects an open submenu while the pointer travels to it.
 */
export function useMenuItem(
    context: MenuContextValue,
    element: HTMLElement | null,
    label: string | undefined,
    isSubmenuTrigger: boolean,
) {
    const [highlighted, setHighlighted] = useState(false);
    const { labels } = context;
    useLayoutEffect(() => {
        if (element === null || label === undefined) {
            return undefined;
        }
        labels.set(element, label);
        return () => {
            labels.delete(element);
        };
    }, [element, label, labels]);

    const onPointerMove = (event: PointerEvent) => {
        if (element === null) {
            return;
        }
        const submenu = context.openSubmenu.current;
        const area = context.safeArea.current;
        if (!isSubmenuTrigger || submenu?.trigger !== element) {
            if (
                submenu &&
                area &&
                isInSafeArea(
                    { x: event.clientX, y: event.clientY },
                    area,
                    area.submenu,
                )
            ) {
                return;
            }
            if (submenu && submenu.trigger !== element) {
                submenu.setOpen(false, "none");
            }
        }
        if (element.ownerDocument.activeElement !== element) {
            element.focus({ preventScroll: true });
        }
    };
    const onPointerLeave = () => {
        const popup = context.popup;
        if (
            element &&
            popup &&
            element.ownerDocument.activeElement === element &&
            !isSubmenuTrigger
        ) {
            popup.focus({ preventScroll: true });
        }
    };
    return {
        highlighted,
        handlers: {
            onFocus: () => setHighlighted(true),
            onBlur: () => setHighlighted(false),
            onPointerMove,
            onPointerLeave,
        },
        isItem: (node: HTMLElement) =>
            context.popup !== null && menuItems(context.popup).includes(node),
    };
}
