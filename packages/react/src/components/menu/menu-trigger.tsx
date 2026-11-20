import type { KeyboardEvent } from "react";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { MenuContext } from "./menu-context.ts";

export interface MenuTriggerState {
    open: boolean;
    disabled: boolean;
}

export interface MenuTriggerProps extends PartProps<MenuTriggerState> {
    disabled?: boolean;
}

/** Opens the root menu (spec/menu.md, "Keyboard": on the Trigger). */
export function MenuTrigger({ disabled = false, ...props }: MenuTriggerProps) {
    const context = useRequiredContext(MenuContext, "Menu.Trigger");
    const state = { open: context.open, disabled };
    const openWith = (
        highlight: "first" | "last",
        reason: "trigger-press" | "list-navigation",
    ) => {
        context.pendingHighlight.current = highlight;
        if (context.open) {
            context.setOpen(true, reason);
        } else {
            context.setOpen(true, reason);
        }
    };
    return renderElement(
        "button",
        props,
        state,
        {
            type: "button",
            id: context.triggerId,
            disabled,
            "aria-haspopup": "menu",
            "aria-expanded": context.open,
            "aria-controls": context.open ? context.popupId : undefined,
            "data-menu-part": "trigger",
            ...stateAttributes({ open: context.open, disabled }),
            onClick: () => {
                context.pendingHighlight.current = null;
                context.setOpen(!context.open, "trigger-press");
            },
            onKeyDown: (event: KeyboardEvent) => {
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
            },
            onKeyUp: (event: KeyboardEvent) => {
                if (event.key === " ") {
                    event.preventDefault();
                }
            },
        },
        context.setTrigger,
    );
}
