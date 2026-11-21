import {
    booleanAttribute,
    computed,
    Directive,
    effect,
    HostAttributeToken,
    inject,
    input,
    output,
} from "@angular/core";
import { createTypeahead } from "@poc/dom";
import type { OpenChangeEvent } from "../../utils/change-details.ts";
import { createOverlayRoot } from "../../utils/overlay-root.ts";
import { placementSignal } from "../../utils/positioner.ts";

/** Where the pointer left an open submenu's trigger, for the safe hover area (spec/menu.md). */
export interface SafeArea {
    x: number;
    y: number;
    submenu: HTMLElement;
}

export interface MenuState {
    open: boolean;
    nested: boolean;
}

/**
 * Holds the state of one menu level (spec/menu.md): `<ng-container menuRoot [(open)]="open">`,
 * or `<ng-container menuSubmenuRoot>` for a nested level, whose trigger is a `menuSubmenuTrigger`
 * item of the parent menu. One directive for both: the attribute tells them apart.
 */
@Directive({
    selector: "[menuRoot], [menuSubmenuRoot]",
    exportAs: "menuRoot",
})
export class MenuRoot {
    readonly open = input<boolean | undefined>(undefined);
    readonly openChange = output<boolean>();
    readonly defaultOpen = input(false);
    /** Arrow keys wrap at the ends (default `true`). */
    readonly loop = input(true, { transform: booleanAttribute });
    readonly openChangeDetails = output<OpenChangeEvent>();

    readonly nested =
        inject(new HostAttributeToken("menuSubmenuRoot"), {
            optional: true,
        }) !== null;
    /** The menu this one is a submenu of. */
    readonly parent: MenuRoot | null = this.nested
        ? inject(MenuRoot, { skipSelf: true, optional: true })
        : null;
    readonly overlay = createOverlayRoot(
        this,
        (event) => this.openChangeDetails.emit(event),
        "poc-menu",
    );
    readonly placed = placementSignal(
        this.nested
            ? { side: "end", align: "start" }
            : { side: "bottom", align: "start" },
    );
    /** The item to highlight when the popup opens: from the keyboard, the first or the last. */
    pendingHighlight: "first" | "last" | null = null;
    readonly typeahead = createTypeahead();
    /** Labels given with the `label` input, by item element. */
    readonly labels = new Map<Element, string>();
    /** The open submenu of this level, so hovering a sibling item can close it. */
    openSubmenu: MenuRoot | null = null;
    safeArea: SafeArea | null = null;
    readonly state = computed<MenuState>(() => ({
        open: this.overlay.open(),
        nested: this.nested,
    }));

    constructor() {
        if (this.nested && this.parent === null) {
            throw new Error("[menuSubmenuRoot] must be inside a [menuRoot].");
        }
        // a parent level knows its open submenu, so a hovered sibling can close it
        effect((onCleanup) => {
            const owner = this.parent;
            if (owner === null || !this.overlay.open()) {
                return;
            }
            owner.openSubmenu = this;
            onCleanup(() => {
                if (owner.openSubmenu === this) {
                    owner.openSubmenu = null;
                }
            });
        });
    }

    /** Closes this level and every level above it. */
    closeAll(reason: "item-press" | "focus-out" | "outside-press"): void {
        this.overlay.setOpen(false, reason);
        this.parent?.closeAll(reason);
    }

    /** The root level of this menu. */
    root(): MenuRoot {
        return this.parent ? this.parent.root() : this;
    }

    /** Every positioner of the chain of open levels, for Tab to skip. */
    positioners(): (HTMLElement | null)[] {
        const own = this.overlay.positioner();
        return this.parent ? [...this.parent.positioners(), own] : [own];
    }
}
