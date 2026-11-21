import {
    getDirection,
    menuKeyTarget,
    nextTabbableAfter,
    openOverlaySession,
    previousTabbableBefore,
    submenuKeys,
} from "@poc/dom";
import { defineComponent, watch } from "vue";
import { elementSetter } from "../../composables/use-overlay-root.ts";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { type MenuContext, MenuKey } from "./menu-context.ts";
import { menuItems } from "./menu-items.ts";

const ROOT_RETURNS_FOCUS = new Set([
    "escape-key",
    "item-press",
    "trigger-press",
]);
const SUBMENU_RETURNS_FOCUS = new Set(["escape-key", "list-navigation"]);

function rootOf(context: MenuContext): MenuContext {
    return context.parent ? rootOf(context.parent) : context;
}

function positioners(context: MenuContext): (HTMLElement | null)[] {
    const own = [context.positioner.value];
    return context.parent ? [...positioners(context.parent), ...own] : own;
}

/** One menu level: roving focus, typeahead, Escape per level (spec/menu.md). */
export const MenuPopup = defineComponent({
    name: "MenuPopup",
    inheritAttrs: false,
    props: asProp,
    setup(props, { attrs, slots }) {
        const context = useRequiredContext(MenuKey, "Menu.Popup");
        const nested = context.parent !== null;
        const setPopup = elementSetter(context.popup);

        watch(
            () =>
                [
                    context.open.value,
                    context.popup.value,
                    context.positioner.value,
                ] as const,
            ([open, popup, positioner], _, onCleanup) => {
                if (!open || popup === null) {
                    return;
                }
                const trigger = context.trigger.value;
                // Escape, an item and the trigger give focus back to this level's trigger; the
                // closing arrow of a submenu gives it back to its submenu trigger
                const session = openOverlaySession(popup.ownerDocument, {
                    elements: () => [positioner ?? popup],
                    ignore: () => [trigger],
                    dismiss: (reason) => context.setOpen(false, reason),
                    returnFocus: {
                        when: nested
                            ? SUBMENU_RETURNS_FOCUS
                            : ROOT_RETURNS_FOCUS,
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
                onCleanup(session.end);
            },
            { flush: "post", immediate: true },
        );

        const onKeydown = (event: KeyboardEvent) => {
            const popup = context.popup.value;
            if (popup === null || event.defaultPrevented) {
                return;
            }
            const items = menuItems(popup);
            const active = popup.ownerDocument
                .activeElement as HTMLElement | null;
            const current = active ? items.indexOf(active) : -1;
            const focusAt = (index: number) =>
                items[index]?.focus({ preventScroll: true });
            const { close: closeKey } = submenuKeys(
                getDirection(popup) === "rtl",
            );
            switch (event.key) {
                case "ArrowDown":
                case "ArrowUp":
                case "Home":
                case "End": {
                    event.preventDefault();
                    const target = menuKeyTarget(
                        event.key,
                        current,
                        items.length,
                        { loop: context.loop() },
                    );
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
                    const rootTrigger = root.trigger.value;
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
                                context.labels.get(item) ??
                                item.textContent ??
                                "",
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

        return () => {
            const open = context.open.value;
            const status = context.presence.status.value;
            const placed = context.placed.value;
            return renderPart(
                "div",
                { attrs, slots },
                props.as,
                { open, ...placed },
                {
                    id: context.popupId,
                    role: "menu",
                    "aria-labelledby": context.triggerId,
                    "aria-orientation": "vertical",
                    tabindex: -1,
                    "data-menu-part": "popup",
                    ...stateAttributes({
                        open,
                        side: placed.side,
                        align: placed.align,
                        nested,
                        "starting-style": status === "starting",
                        "ending-style": status === "ending",
                    }),
                    onKeydown,
                    ref: setPopup,
                },
            );
        };
    },
});
