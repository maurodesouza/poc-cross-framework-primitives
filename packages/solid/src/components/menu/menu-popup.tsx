import {
    getDirection,
    menuKeyTarget,
    nextTabbableAfter,
    openOverlaySession,
    previousTabbableBefore,
    submenuKeys,
} from "@poc/dom";
import { createEffect } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { type MenuContextValue, useMenuContext } from "./menu-context.ts";
import { menuItems } from "./menu-items.ts";

const ROOT_RETURNS_FOCUS = new Set([
    "escape-key",
    "item-press",
    "trigger-press",
]);
const SUBMENU_RETURNS_FOCUS = new Set(["escape-key", "list-navigation"]);

function rootOf(context: MenuContextValue): MenuContextValue {
    return context.parent ? rootOf(context.parent) : context;
}

/** Every positioner of the chain of open levels, for Tab to skip. */
function positioners(context: MenuContextValue): (HTMLElement | null)[] {
    const own = [context.positioner()];
    return context.parent ? [...positioners(context.parent), ...own] : own;
}

/** One menu level: roving focus, typeahead, Escape per level (spec/menu.md). */
export function MenuPopup(
    props: PartProps<{ open: boolean; side: string; align: string }>,
) {
    const context = useMenuContext("Menu.Popup");
    const nested = context.parent !== null;

    createEffect(
        () => ({
            open: context.open(),
            popup: context.popup(),
            positioner: context.positioner(),
            trigger: context.trigger(),
        }),
        ({ open, popup, positioner, trigger }) => {
            if (!open || popup === null) {
                return undefined;
            }
            // Escape, an item and the trigger give focus back to this level's trigger; the
            // closing arrow of a submenu gives it back to its submenu trigger
            const session = openOverlaySession(popup.ownerDocument, {
                elements: () => [positioner ?? popup],
                ignore: () => [trigger],
                dismiss: (reason) => context.setOpen(false, reason),
                returnFocus: {
                    when: nested ? SUBMENU_RETURNS_FOCUS : ROOT_RETURNS_FOCUS,
                    reason: () => context.lastReason.current,
                    to: () => trigger,
                },
            });
            const items = menuItems(popup);
            const highlight = context.pendingHighlight.current;
            context.pendingHighlight.current = null;
            const target =
                highlight === "first"
                    ? items[0]
                    : highlight === "last"
                      ? items.at(-1)
                      : undefined;
            (target ?? popup).focus({ preventScroll: true });
            return session.end;
        },
    );

    const onKeyDown = (event: KeyboardEvent) => {
        const popup = context.popup();
        if (popup === null || event.defaultPrevented) {
            return;
        }
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
                    loop: context.loop(),
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
                const root = rootOf(context);
                const skip = positioners(context);
                const rootTrigger = root.trigger();
                const target = rootTrigger
                    ? event.shiftKey
                        ? previousTabbableBefore(rootTrigger, skip)
                        : nextTabbableAfter(rootTrigger, skip)
                    : null;
                context.closeAll("focus-out");
                target?.focus();
                return;
            }
            default:
                if (nested && event.key === closeKey) {
                    event.preventDefault();
                    context.setOpen(false, "list-navigation");
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
                            context.labels.get(item) ?? item.textContent ?? "",
                    );
                    const index = context.typeahead.match(
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
    };

    const state = () => ({ open: context.open(), ...context.placed() });
    return renderPart(
        "div",
        props,
        state,
        () => ({
            id: context.popupId,
            role: "menu",
            "aria-labelledby": context.triggerId,
            "aria-orientation": "vertical",
            tabindex: -1,
            "data-menu-part": "popup",
            ...stateAttributes({
                ...state(),
                nested,
                "starting-style": context.presence.status() === "starting",
                "ending-style": context.presence.status() === "ending",
            }),
            onKeyDown,
        }),
        { ref: context.setPopup },
    );
}
