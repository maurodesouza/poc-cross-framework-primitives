import { getDirection, submenuKeys } from "@poc/dom";
import { createSignal, onSettled, useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { createMenuItem } from "./create-menu-item.ts";
import { MenuContext, useMenuContext } from "./menu-context.ts";

export interface MenuSubmenuTriggerState {
    open: boolean;
    highlighted: boolean;
    disabled: boolean;
}

export interface MenuSubmenuTriggerProps
    extends PartProps<MenuSubmenuTriggerState> {
    disabled?: boolean;
    label?: string;
    /** Hovering opens the submenu (default `true`), after `delay` ms (default 100). */
    openOnHover?: boolean;
    delay?: number;
}

/** An item of the parent menu that opens its submenu (spec/menu.md). */
export function MenuSubmenuTrigger(props: MenuSubmenuTriggerProps) {
    const submenu = useMenuContext("Menu.SubmenuTrigger");
    const parent = submenu.parent;
    if (parent === null) {
        throw new Error(
            "<Menu.SubmenuTrigger> must be inside <Menu.SubmenuRoot>.",
        );
    }
    const isOwnTrigger = useContext(MenuContext) === submenu;
    const [element, setElement] = createSignal<HTMLElement | null>(null);
    const item = createMenuItem(parent, element, () => props.label, true);
    let timer: ReturnType<typeof setTimeout> | undefined;
    onSettled(() => () => clearTimeout(timer));
    const disabled = () => props.disabled ?? false;

    const open = (
        highlight: "first" | null,
        reason: "trigger-press" | "list-navigation",
    ) => {
        if (disabled()) {
            return;
        }
        submenu.pendingHighlight.current = highlight;
        submenu.setOpen(true, reason);
    };
    const state = () => ({
        open: submenu.open(),
        highlighted: item.highlighted(),
        disabled: disabled(),
    });
    return renderPart(
        "div",
        props,
        state,
        () => ({
            id: submenu.triggerId,
            role: "menuitem",
            tabindex: -1,
            "aria-haspopup": "menu",
            "aria-expanded": String(submenu.open()),
            "aria-controls": submenu.open() ? submenu.popupId : undefined,
            "aria-disabled": disabled() ? "true" : undefined,
            "data-menu-part": "submenu-trigger",
            ...stateAttributes(state()),
            ...item.handlers,
            onClick: () => open(null, "trigger-press"),
            onKeyDown: (event: KeyboardEvent) => {
                const node = element();
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
            onPointerMove: (event: PointerEvent) => {
                item.handlers.onPointerMove(event);
                if (
                    (props.openOnHover ?? true) &&
                    !submenu.open() &&
                    timer === undefined
                ) {
                    timer = setTimeout(() => {
                        timer = undefined;
                        open(null, "trigger-press");
                    }, props.delay ?? 100);
                }
            },
            onPointerLeave: (event: PointerEvent) => {
                clearTimeout(timer);
                timer = undefined;
                const popup = submenu.popup();
                if (submenu.open() && popup) {
                    parent.safeArea.current = {
                        x: event.clientX,
                        y: event.clientY,
                        submenu: popup,
                    };
                }
            },
        }),
        {
            ref: (node) => {
                setElement(node);
                if (isOwnTrigger) {
                    submenu.setTrigger(node);
                }
            },
            omit: ["disabled", "label", "openOnHover", "delay"],
        },
    );
}
