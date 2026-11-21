import {
    booleanAttribute,
    computed,
    Directive,
    inject,
    input,
} from "@angular/core";
import { registerHost } from "../../utils/host-element.ts";
import { dataValues } from "../../utils/state-attributes.ts";
import { MenuRoot } from "./menu-root.directive.ts";

export interface MenuTriggerState {
    open: boolean;
    disabled: boolean;
}

/** Opens the root menu (spec/menu.md, "Keyboard": on the Trigger): `<button menuTrigger>`. */
@Directive({
    selector: "[menuTrigger]",
    exportAs: "menuTrigger",
    host: {
        type: "button",
        "aria-haspopup": "menu",
        "data-menu-part": "trigger",
        "[attr.id]": "level.overlay.triggerId",
        "[attr.disabled]": "data().disabled",
        "[attr.aria-expanded]": "String(state().open)",
        "[attr.aria-controls]": "state().open ? level.overlay.popupId : null",
        "[attr.data-open]": "data().open",
        "[attr.data-disabled]": "data().disabled",
        "(click)": "onClick()",
        "(keydown)": "onKeyDown($event)",
        "(keyup)": "onKeyUp($event)",
    },
})
export class MenuTrigger {
    protected readonly level = inject(MenuRoot);
    readonly disabled = input(false, { transform: booleanAttribute });
    readonly state = computed<MenuTriggerState>(() => ({
        open: this.level.overlay.open(),
        disabled: this.disabled(),
    }));
    protected readonly data = computed(() => dataValues(this.state()));
    protected readonly String = String;

    constructor() {
        registerHost(this.level.overlay.trigger);
    }

    protected onClick(): void {
        this.level.pendingHighlight = null;
        this.level.overlay.setOpen(!this.state().open, "trigger-press");
    }

    protected onKeyDown(event: KeyboardEvent): void {
        const openWith = (
            highlight: "first" | "last",
            reason: "trigger-press" | "list-navigation",
        ) => {
            this.level.pendingHighlight = highlight;
            this.level.overlay.setOpen(true, reason);
        };
        if (event.key === "ArrowDown") {
            event.preventDefault();
            openWith("first", "list-navigation");
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            openWith("last", "list-navigation");
        } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openWith("first", "trigger-press");
        }
    }

    protected onKeyUp(event: KeyboardEvent): void {
        if (event.key === " ") {
            event.preventDefault();
        }
    }
}
