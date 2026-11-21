import { DestroyRef, effect, inject, type Signal, signal } from "@angular/core";
import { isInSafeArea } from "@poc/dom";
import type { MenuRoot } from "./menu-root.directive.ts";

/**
 * What every item of a menu level shares: highlight follows focus, the pointer highlights, the
 * typeahead label, and the safe area that protects an open submenu while the pointer travels to it.
 */
export function menuItemBehaviour(
    level: MenuRoot,
    element: HTMLElement,
    label: Signal<string | undefined>,
    isSubmenuTrigger: boolean,
) {
    const highlighted = signal(false);
    effect(() => {
        const text = label();
        if (text === undefined) {
            level.labels.delete(element);
        } else {
            level.labels.set(element, text);
        }
    });
    inject(DestroyRef).onDestroy(() => level.labels.delete(element));
    return {
        highlighted: highlighted.asReadonly(),
        onFocus: () => highlighted.set(true),
        onBlur: () => highlighted.set(false),
        onPointerMove: (event: PointerEvent) => {
            const submenu = level.openSubmenu;
            const area = level.safeArea;
            const openTrigger = submenu?.overlay.trigger() ?? null;
            if (!isSubmenuTrigger || openTrigger !== element) {
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
                if (submenu && openTrigger !== element) {
                    submenu.overlay.setOpen(false, "none");
                }
            }
            if (element.ownerDocument.activeElement !== element) {
                element.focus({ preventScroll: true });
            }
        },
        onPointerLeave: () => {
            const popup = level.overlay.popup();
            if (
                popup &&
                element.ownerDocument.activeElement === element &&
                !isSubmenuTrigger
            ) {
                popup.focus({ preventScroll: true });
            }
        },
    };
}
