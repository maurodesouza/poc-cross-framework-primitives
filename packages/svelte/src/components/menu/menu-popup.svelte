<script lang="ts">
import {
    getDirection,
    menuKeyTarget,
    nextTabbableAfter,
    openOverlaySession,
    previousTabbableBefore,
    submenuKeys,
} from "@poc/dom";
import { elementRef } from "../../utils/element-ref.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { MenuContext, type MenuState } from "./menu-context.svelte.ts";
import { menuItems } from "./menu-items.ts";

const ROOT_RETURNS_FOCUS = new Set([
    "escape-key",
    "item-press",
    "trigger-press",
]);
const SUBMENU_RETURNS_FOCUS = new Set(["escape-key", "list-navigation"]);

/** One menu level: roving focus, typeahead, Escape per level (spec/menu.md). */
let {
    child,
    children,
    ...rest
}: PartProps<{ open: boolean; side: string; align: string }> = $props();
const context = MenuContext.use("Menu.Popup");
const nested = context.parent !== null;
const ref = elementRef((element) => (context.popup = element));

const rootOf = (menu: MenuState): MenuState =>
    menu.parent ? rootOf(menu.parent) : menu;
const positioners = (menu: MenuState): (HTMLElement | null)[] =>
    menu.parent
        ? [...positioners(menu.parent), menu.positioner]
        : [menu.positioner];

$effect(() => {
    const popup = context.popup;
    const positioner = context.positioner;
    if (!context.open || popup === null) {
        return undefined;
    }
    const trigger = context.trigger;
    // Escape, an item and the trigger give focus back to this level's trigger; the closing
    // arrow of a submenu gives it back to its submenu trigger
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
});

const onkeydown = (event: KeyboardEvent) => {
    const popup = context.popup;
    if (popup === null || event.defaultPrevented) {
        return;
    }
    const items = menuItems(popup);
    const active = popup.ownerDocument.activeElement as HTMLElement | null;
    const current = active ? items.indexOf(active) : -1;
    const focusAt = (index: number) =>
        items[index]?.focus({ preventScroll: true });
    const target = menuKeyTarget(event.key, current, items.length, {
        loop: context.loop(),
    });
    if (target !== null) {
        event.preventDefault();
        focusAt(target);
        return;
    }
    if (
        (event.key === "Enter" || event.key === " ") &&
        active &&
        current !== -1
    ) {
        event.preventDefault();
        active.click();
        return;
    }
    if (event.key === "Tab") {
        event.preventDefault();
        const root = rootOf(context);
        const skip = positioners(context);
        const rootTrigger = root.trigger;
        const next = rootTrigger
            ? event.shiftKey
                ? previousTabbableBefore(rootTrigger, skip)
                : nextTabbableAfter(rootTrigger, skip)
            : null;
        context.closeAll("focus-out");
        next?.focus();
        return;
    }
    if (
        nested &&
        event.key === submenuKeys(getDirection(popup) === "rtl").close
    ) {
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
            (item) => context.labels.get(item) ?? item.textContent ?? "",
        );
        const index = context.typeahead.match(event.key, labels, current);
        if (index !== -1) {
            event.preventDefault();
            focusAt(index);
        }
    }
};

const state = $derived({ open: context.open, ...context.placed });
const partProps = $derived(
    mergeProps(
        {
            id: context.popupId,
            role: "menu",
            "aria-labelledby": context.triggerId,
            "aria-orientation": "vertical",
            tabindex: -1,
            "data-menu-part": "popup",
            ...stateAttributes({
                open: context.open,
                side: context.placed.side,
                align: context.placed.align,
                nested,
                "starting-style": context.presence.status === "starting",
                "ending-style": context.presence.status === "ending",
            }),
            onkeydown,
            ...ref,
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state })}{:else}<div {...partProps}>{@render children?.()}</div>{/if}
