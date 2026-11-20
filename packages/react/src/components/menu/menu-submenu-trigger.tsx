import { getDirection } from "@poc/dom";
import {
    type KeyboardEvent,
    type PointerEvent,
    useContext,
    useEffect,
    useRef,
} from "react";
import { useElement } from "../../hooks/use-element.ts";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { mergeRefs } from "../../utils/merge-refs.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { MenuContext } from "./menu-context.ts";
import { useMenuItem } from "./use-menu-item.ts";

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
export function MenuSubmenuTrigger({
    disabled = false,
    label,
    openOnHover = true,
    delay = 100,
    ...props
}: MenuSubmenuTriggerProps) {
    const submenu = useRequiredContext(MenuContext, "Menu.SubmenuTrigger");
    const parent = submenu.parent;
    if (parent === null) {
        throw new Error(
            "<Menu.SubmenuTrigger> must be inside <Menu.SubmenuRoot>.",
        );
    }
    const [element, ref] = useElement<HTMLElement>();
    const item = useMenuItem(parent, element, label, true);
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    useEffect(() => () => clearTimeout(timer.current), []);
    const context = useContext(MenuContext);

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
    const state = {
        open: submenu.open,
        highlighted: item.highlighted,
        disabled,
    };
    return renderElement(
        "div",
        props,
        state,
        {
            id: submenu.triggerId,
            role: "menuitem",
            tabIndex: -1,
            "aria-haspopup": "menu",
            "aria-expanded": submenu.open,
            "aria-controls": submenu.open ? submenu.popupId : undefined,
            "aria-disabled": disabled ? "true" : undefined,
            "data-menu-part": "submenu-trigger",
            ...stateAttributes({
                open: submenu.open,
                highlighted: item.highlighted,
                disabled,
            }),
            ...item.handlers,
            onClick: () => open(null, "trigger-press"),
            onKeyDown: (event: KeyboardEvent) => {
                const openKey =
                    element && getDirection(element) === "rtl"
                        ? "ArrowLeft"
                        : "ArrowRight";
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
                    openOnHover &&
                    !submenu.open &&
                    timer.current === undefined
                ) {
                    timer.current = setTimeout(() => {
                        timer.current = undefined;
                        open(null, "trigger-press");
                    }, delay);
                }
            },
            onPointerLeave: (event: PointerEvent) => {
                clearTimeout(timer.current);
                timer.current = undefined;
                if (submenu.open && submenu.popup) {
                    parent.safeArea.current = {
                        x: event.clientX,
                        y: event.clientY,
                        submenu: submenu.popup,
                    };
                }
            },
        },
        mergeRefs(ref, context === submenu ? submenu.setTrigger : undefined),
    );
}
