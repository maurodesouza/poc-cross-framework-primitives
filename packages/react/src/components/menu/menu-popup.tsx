import {
    getDirection,
    nextTabbableAfter,
    previousTabbableBefore,
    pushLayer,
    stepIndex,
} from "@poc/dom";
import { type KeyboardEvent, useEffect } from "react";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { MenuContext, type MenuContextValue } from "./menu-context.ts";
import { menuItems } from "./menu-items.ts";

function rootOf(context: MenuContextValue): MenuContextValue {
    return context.parent ? rootOf(context.parent) : context;
}

/** Every positioner of the chain of open levels, for Tab to skip. */
function positioners(context: MenuContextValue): (HTMLElement | null)[] {
    const own = [context.positioner];
    return context.parent ? [...positioners(context.parent), ...own] : own;
}

/** One menu level: roving focus, typeahead, Escape per level (spec/menu.md). */
export function MenuPopup(
    props: PartProps<{ open: boolean; side: string; align: string }>,
) {
    const context = useRequiredContext(MenuContext, "Menu.Popup");
    const {
        open,
        popup,
        positioner,
        trigger,
        setOpen,
        lastReason,
        pendingHighlight,
    } = context;
    const nested = context.parent !== null;

    useEffect(() => {
        if (!open || popup === null) {
            return undefined;
        }
        const doc = popup.ownerDocument;
        const layer = pushLayer(doc, {
            elements: () => [positioner ?? popup],
            ignore: () => [trigger],
            onEscape: () => setOpen(false, "escape-key"),
            onOutsidePress: () => setOpen(false, "outside-press"),
        });
        const items = menuItems(popup);
        const highlight = pendingHighlight.current;
        pendingHighlight.current = null;
        const target =
            highlight === "first"
                ? items[0]
                : highlight === "last"
                  ? items.at(-1)
                  : undefined;
        (target ?? popup).focus({ preventScroll: true });
        return () => {
            layer.remove();
            // Escape, an item and the trigger give focus back to this level's trigger; the left
            // arrow of a submenu gives it back to its submenu trigger
            const reason = lastReason.current;
            const returns = nested
                ? reason === "escape-key" || reason === "list-navigation"
                : reason === "escape-key" ||
                  reason === "item-press" ||
                  reason === "trigger-press";
            if (returns) {
                trigger?.focus({ preventScroll: true });
            }
        };
    }, [
        open,
        popup,
        positioner,
        trigger,
        setOpen,
        lastReason,
        pendingHighlight,
        nested,
    ]);

    const onKeyDown = (event: KeyboardEvent) => {
        if (popup === null || event.defaultPrevented) {
            return;
        }
        const items = menuItems(popup);
        const active = popup.ownerDocument.activeElement as HTMLElement | null;
        const current = active ? items.indexOf(active) : -1;
        const focusAt = (index: number) =>
            items[index]?.focus({ preventScroll: true });
        const closeKey =
            getDirection(popup) === "rtl" ? "ArrowRight" : "ArrowLeft";
        switch (event.key) {
            case "ArrowDown":
            case "ArrowUp":
                event.preventDefault();
                focusAt(
                    stepIndex(
                        items.length,
                        current,
                        event.key === "ArrowDown" ? 1 : -1,
                        { loop: context.loop },
                    ),
                );
                return;
            case "Home":
            case "End":
                event.preventDefault();
                focusAt(event.key === "Home" ? 0 : items.length - 1);
                return;
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
                const target = root.trigger
                    ? event.shiftKey
                        ? previousTabbableBefore(root.trigger, skip)
                        : nextTabbableAfter(root.trigger, skip)
                    : null;
                context.closeAll("focus-out");
                target?.focus();
                return;
            }
            default:
                if (nested && event.key === closeKey) {
                    event.preventDefault();
                    setOpen(false, "list-navigation");
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

    const status = context.presence.status;
    return renderElement(
        "div",
        props,
        { open, ...context.placed },
        {
            id: context.popupId,
            role: "menu",
            "aria-labelledby": context.triggerId,
            "aria-orientation": "vertical",
            tabIndex: -1,
            "data-menu-part": "popup",
            ...stateAttributes({
                open,
                side: context.placed.side,
                align: context.placed.align,
                nested,
                "starting-style": status === "starting",
                "ending-style": status === "ending",
            }),
            onKeyDown,
        },
        context.setPopup,
    );
}
