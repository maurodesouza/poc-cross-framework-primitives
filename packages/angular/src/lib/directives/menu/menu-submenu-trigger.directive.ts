import {
    booleanAttribute,
    computed,
    DestroyRef,
    Directive,
    inject,
    input,
    numberAttribute,
} from "@angular/core";
import { getDirection, submenuKeys } from "@poc/dom";
import { registerHost } from "../../utils/host-element.ts";
import { dataValues } from "../../utils/state-attributes.ts";
import { menuItemBehaviour } from "./menu-item-behaviour.ts";
import { MenuRoot } from "./menu-root.directive.ts";

export interface MenuSubmenuTriggerState {
    open: boolean;
    highlighted: boolean;
    disabled: boolean;
}

/**
 * An item of the parent menu that opens its submenu (spec/menu.md), inside the
 * `[menuSubmenuRoot]`: `<div menuSubmenuTrigger>`.
 */
@Directive({
    selector: "[menuSubmenuTrigger]",
    exportAs: "menuSubmenuTrigger",
    host: {
        role: "menuitem",
        tabindex: "-1",
        "aria-haspopup": "menu",
        "data-menu-part": "submenu-trigger",
        "[attr.id]": "submenu.overlay.triggerId",
        "[attr.aria-expanded]": "String(state().open)",
        "[attr.aria-controls]": "state().open ? submenu.overlay.popupId : null",
        "[attr.aria-disabled]": "state().disabled ? 'true' : null",
        "[attr.data-open]": "data().open",
        "[attr.data-highlighted]": "data().highlighted",
        "[attr.data-disabled]": "data().disabled",
        "(focus)": "item.onFocus()",
        "(blur)": "item.onBlur()",
        "(click)": "openSubmenu(null, 'trigger-press')",
        "(keydown)": "onKeyDown($event)",
        "(pointermove)": "onPointerMove($event)",
        "(pointerleave)": "onPointerLeave($event)",
    },
})
export class MenuSubmenuTrigger {
    protected readonly submenu = inject(MenuRoot);
    private readonly parent = this.requireParent();
    readonly disabled = input(false, { transform: booleanAttribute });
    readonly label = input<string | undefined>(undefined);
    /** Hovering opens the submenu (default `true`), after `delay` ms (default 100). */
    readonly openOnHover = input(true, { transform: booleanAttribute });
    readonly delay = input(100, { transform: numberAttribute });
    private readonly host = registerHost(this.submenu.overlay.trigger);
    protected readonly item = menuItemBehaviour(
        this.parent,
        this.host,
        this.label,
        true,
    );
    readonly state = computed<MenuSubmenuTriggerState>(() => ({
        open: this.submenu.overlay.open(),
        highlighted: this.item.highlighted(),
        disabled: this.disabled(),
    }));
    protected readonly data = computed(() => dataValues(this.state()));
    protected readonly String = String;
    private timer: ReturnType<typeof setTimeout> | undefined;

    constructor() {
        inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
    }

    private requireParent(): MenuRoot {
        if (this.submenu.parent === null) {
            throw new Error(
                "[menuSubmenuTrigger] must be inside a [menuSubmenuRoot].",
            );
        }
        return this.submenu.parent;
    }

    protected openSubmenu(
        highlight: "first" | null,
        reason: "trigger-press" | "list-navigation",
    ): void {
        if (this.disabled()) {
            return;
        }
        this.submenu.pendingHighlight = highlight;
        this.submenu.overlay.setOpen(true, reason);
    }

    protected onKeyDown(event: KeyboardEvent): void {
        const { open: openKey } = submenuKeys(
            getDirection(this.host) === "rtl",
        );
        if (
            event.key === openKey ||
            event.key === "Enter" ||
            event.key === " "
        ) {
            event.preventDefault();
            event.stopPropagation();
            this.openSubmenu(
                "first",
                event.key === openKey ? "list-navigation" : "trigger-press",
            );
        }
    }

    protected onPointerMove(event: PointerEvent): void {
        this.item.onPointerMove(event);
        if (
            this.openOnHover() &&
            !this.submenu.overlay.open() &&
            this.timer === undefined
        ) {
            this.timer = setTimeout(() => {
                this.timer = undefined;
                this.openSubmenu(null, "trigger-press");
            }, this.delay());
        }
    }

    protected onPointerLeave(event: PointerEvent): void {
        clearTimeout(this.timer);
        this.timer = undefined;
        const popup = this.submenu.overlay.popup();
        if (this.submenu.overlay.open() && popup) {
            this.parent.safeArea = {
                x: event.clientX,
                y: event.clientY,
                submenu: popup,
            };
        }
    }
}
