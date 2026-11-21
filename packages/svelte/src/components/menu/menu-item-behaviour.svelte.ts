import { isInSafeArea } from "@poc/dom";
import type { MenuState } from "./menu-context.svelte.ts";

/**
 * What every item of a menu level shares: highlight follows focus, the pointer highlights, the
 * typeahead label, and the safe area that protects an open submenu on the pointer's way to it.
 */
export class MenuItemBehaviour {
    highlighted = $state(false);
    element = $state<HTMLElement | null>(null);

    constructor(
        readonly menu: MenuState,
        readonly label: () => string | undefined,
        readonly isSubmenuTrigger: boolean,
    ) {
        $effect(() => {
            const node = this.element;
            const text = this.label();
            if (node === null || text === undefined) {
                return undefined;
            }
            menu.labels.set(node, text);
            return () => menu.labels.delete(node);
        });
    }

    readonly handlers = {
        onfocus: () => {
            this.highlighted = true;
        },
        onblur: () => {
            this.highlighted = false;
        },
        onpointermove: (event: PointerEvent) => {
            const node = this.element;
            if (node === null) {
                return;
            }
            const submenu = this.menu.openSubmenu.current;
            const area = this.menu.safeArea.current;
            if (!this.isSubmenuTrigger || submenu?.trigger !== node) {
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
                if (submenu && submenu.trigger !== node) {
                    submenu.setOpen(false, "none");
                }
            }
            if (node.ownerDocument.activeElement !== node) {
                node.focus({ preventScroll: true });
            }
        },
        onpointerleave: () => {
            const node = this.element;
            const popup = this.menu.popup;
            if (
                node &&
                popup &&
                node.ownerDocument.activeElement === node &&
                !this.isSubmenuTrigger
            ) {
                popup.focus({ preventScroll: true });
            }
        },
    };
}
