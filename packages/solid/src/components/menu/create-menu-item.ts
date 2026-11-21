import { isInSafeArea } from "@poc/dom";
import { createEffect, createSignal } from "solid-js";
import type { MenuContextValue } from "./menu-context.ts";

/**
 * What every item of a menu level shares: highlight follows focus, the pointer highlights, the
 * typeahead label, and the safe area that protects an open submenu while the pointer travels to it.
 */
export function createMenuItem(
    context: MenuContextValue,
    element: () => HTMLElement | null,
    label: () => string | undefined,
    isSubmenuTrigger: boolean,
) {
    const [highlighted, setHighlighted] = createSignal(false);
    createEffect(
        () => ({ node: element(), text: label() }),
        ({ node, text }) => {
            if (node === null || text === undefined) {
                return undefined;
            }
            context.labels.set(node, text);
            return () => {
                context.labels.delete(node);
            };
        },
    );

    const onPointerMove = (event: PointerEvent) => {
        const node = element();
        if (node === null) {
            return;
        }
        const submenu = context.openSubmenu.current;
        const area = context.safeArea.current;
        if (!isSubmenuTrigger || submenu?.trigger() !== node) {
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
            if (submenu && submenu.trigger() !== node) {
                submenu.setOpen(false, "none");
            }
        }
        if (node.ownerDocument.activeElement !== node) {
            node.focus({ preventScroll: true });
        }
    };
    const onPointerLeave = () => {
        const node = element();
        const popup = context.popup();
        if (
            node &&
            popup &&
            node.ownerDocument.activeElement === node &&
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
    };
}
