import {
    afterRenderEffect,
    computed,
    Directive,
    inject,
    untracked,
} from "@angular/core";
import {
    getDirection,
    menuKeyTarget,
    nextTabbableAfter,
    openOverlaySession,
    previousTabbableBefore,
    submenuKeys,
} from "@poc/dom";
import { registerHost } from "../../utils/host-element.ts";
import { dataValues } from "../../utils/state-attributes.ts";
import { menuItems } from "./menu-items.ts";
import { MenuRoot } from "./menu-root.directive.ts";

export interface MenuPopupState {
    open: boolean;
    side: string;
    align: string;
}

const ROOT_RETURNS_FOCUS = new Set([
    "escape-key",
    "item-press",
    "trigger-press",
]);
const SUBMENU_RETURNS_FOCUS = new Set(["escape-key", "list-navigation"]);

/** One menu level: roving focus, typeahead, Escape per level (spec/menu.md): `<div menuPopup>`. */
@Directive({
    selector: "[menuPopup]",
    exportAs: "menuPopup",
    host: {
        role: "menu",
        "aria-orientation": "vertical",
        tabindex: "-1",
        "data-menu-part": "popup",
        "[attr.id]": "level.overlay.popupId",
        "[attr.aria-labelledby]": "level.overlay.triggerId",
        "[attr.data-open]": "data().open",
        "[attr.data-side]": "data().side",
        "[attr.data-align]": "data().align",
        "[attr.data-nested]": "data().nested",
        "[attr.data-starting-style]": "data()['starting-style']",
        "[attr.data-ending-style]": "data()['ending-style']",
        "(keydown)": "onKeyDown($event)",
    },
})
export class MenuPopup {
    protected readonly level = inject(MenuRoot);
    readonly state = computed<MenuPopupState>(() => ({
        open: this.level.overlay.open(),
        ...this.level.placed(),
    }));
    protected readonly data = computed(() => {
        const status = this.level.overlay.presence.status();
        return dataValues({
            ...this.state(),
            nested: this.level.nested,
            "starting-style": status === "starting",
            "ending-style": status === "ending",
        });
    });
    private readonly popup = registerHost(this.level.overlay.popup);

    constructor() {
        const level = this.level;
        const overlay = level.overlay;
        const popup = this.popup;
        afterRenderEffect((onCleanup) => {
            const open = overlay.open();
            const positioner = overlay.positioner();
            const trigger = overlay.trigger();
            if (!open) {
                return;
            }
            untracked(() => {
                // Escape, an item and the trigger give focus back to this level's trigger; the
                // closing arrow of a submenu gives it back to its submenu trigger
                const session = openOverlaySession(popup.ownerDocument, {
                    elements: () => [positioner ?? popup],
                    ignore: () => [trigger],
                    dismiss: (reason) => overlay.setOpen(false, reason),
                    returnFocus: {
                        when: level.nested
                            ? SUBMENU_RETURNS_FOCUS
                            : ROOT_RETURNS_FOCUS,
                        reason: () => overlay.lastReason.current,
                        to: () => trigger,
                    },
                });
                const items = menuItems(popup);
                const highlight = level.pendingHighlight;
                level.pendingHighlight = null;
                const target =
                    highlight === "first"
                        ? items[0]
                        : highlight === "last"
                          ? items.at(-1)
                          : undefined;
                (target ?? popup).focus({ preventScroll: true });
                onCleanup(session.end);
            });
        });
    }

    protected onKeyDown(event: KeyboardEvent): void {
        if (event.defaultPrevented) {
            return;
        }
        const level = this.level;
        const popup = this.popup;
        const items = menuItems(popup);
        const active = popup.ownerDocument.activeElement as HTMLElement | null;
        const current = active ? items.indexOf(active) : -1;
        const focusAt = (index: number) =>
            items[index]?.focus({ preventScroll: true });
        const { close: closeKey } = submenuKeys(getDirection(popup) === "rtl");
        switch (event.key) {
            case "ArrowDown":
            case "ArrowUp":
            case "Home":
            case "End": {
                event.preventDefault();
                const target = menuKeyTarget(event.key, current, items.length, {
                    loop: level.loop(),
                });
                if (target !== null) {
                    focusAt(target);
                }
                return;
            }
            case "Enter":
            case " ":
                if (active && current !== -1) {
                    event.preventDefault();
                    active.click();
                }
                return;
            case "Tab": {
                event.preventDefault();
                const trigger = level.root().overlay.trigger();
                const skip = level.positioners();
                const target = trigger
                    ? event.shiftKey
                        ? previousTabbableBefore(trigger, skip)
                        : nextTabbableAfter(trigger, skip)
                    : null;
                level.closeAll("focus-out");
                target?.focus();
                return;
            }
            default:
                if (level.nested && event.key === closeKey) {
                    event.preventDefault();
                    level.overlay.setOpen(false, "list-navigation");
                    return;
                }
                if (
                    event.key.length === 1 &&
                    !event.ctrlKey &&
                    !event.metaKey &&
                    !event.altKey
                ) {
                    const labels = items.map(
                        (item) =>
                            level.labels.get(item) ?? item.textContent ?? "",
                    );
                    const index = level.typeahead.match(
                        event.key,
                        labels,
                        current,
                    );
                    if (index !== -1) {
                        event.preventDefault();
                        focusAt(index);
                    }
                }
        }
    }
}
