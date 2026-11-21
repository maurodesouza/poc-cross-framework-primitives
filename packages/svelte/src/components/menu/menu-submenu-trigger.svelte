<script lang="ts">
import { getDirection, submenuKeys } from "@poc/dom";
import { elementRef } from "../../utils/element-ref.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { MenuContext } from "./menu-context.svelte.ts";
import { MenuItemBehaviour } from "./menu-item-behaviour.svelte.ts";

/** An item of the parent menu that opens its submenu (spec/menu.md). */
let {
    child,
    children,
    disabled = false,
    label,
    openOnHover = true,
    delay = 100,
    ...rest
}: PartProps<{ open: boolean; highlighted: boolean; disabled: boolean }> & {
    disabled?: boolean;
    label?: string;
    openOnHover?: boolean;
    delay?: number;
} = $props();
const submenu = MenuContext.use("Menu.SubmenuTrigger");
const parent = submenu.parent;
if (parent === null) {
    throw new Error("<Menu.SubmenuTrigger> must be inside <Menu.SubmenuRoot>.");
}
const item = new MenuItemBehaviour(parent, () => label, true);
const ref = elementRef((element) => {
    item.element = element;
    submenu.trigger = element;
});
let timer: ReturnType<typeof setTimeout> | undefined;
$effect(() => () => clearTimeout(timer));
const open = (
    highlight: "first" | null,
    reason: "trigger-press" | "list-navigation",
) => {
    if (disabled) {
        return;
    }
    submenu.pendingHighlight.current = highlight;
    submenu.setOpen(true, reason);
};
const partState = $derived({
    open: submenu.open,
    highlighted: item.highlighted,
    disabled,
});
const partProps = $derived(
    mergeProps(
        {
            id: submenu.triggerId,
            role: "menuitem",
            tabindex: -1,
            "aria-haspopup": "menu",
            "aria-expanded": submenu.open ? "true" : "false",
            "aria-controls": submenu.open ? submenu.popupId : undefined,
            "aria-disabled": disabled ? "true" : undefined,
            "data-menu-part": "submenu-trigger",
            ...stateAttributes({
                open: submenu.open,
                highlighted: item.highlighted,
                disabled,
            }),
            onfocus: item.handlers.onfocus,
            onblur: item.handlers.onblur,
            onclick: () => open(null, "trigger-press"),
            onkeydown: (event: KeyboardEvent) => {
                const node = item.element;
                const { open: openKey } = submenuKeys(
                    node !== null && getDirection(node) === "rtl",
                );
                if (
                    event.key === openKey ||
                    event.key === "Enter" ||
                    event.key === " "
                ) {
                    event.preventDefault();
                    event.stopPropagation();
                    open(
                        "first",
                        event.key === openKey
                            ? "list-navigation"
                            : "trigger-press",
                    );
                }
            },
            onpointermove: (event: PointerEvent) => {
                item.handlers.onpointermove(event);
                if (openOnHover && !submenu.open && timer === undefined) {
                    timer = setTimeout(() => {
                        timer = undefined;
                        open(null, "trigger-press");
                    }, delay);
                }
            },
            onpointerleave: (event: PointerEvent) => {
                clearTimeout(timer);
                timer = undefined;
                const popup = submenu.popup;
                if (submenu.open && popup) {
                    parent.safeArea.current = {
                        x: event.clientX,
                        y: event.clientY,
                        submenu: popup,
                    };
                }
            },
            ...ref,
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<div {...partProps}>{@render children?.()}</div>{/if}
