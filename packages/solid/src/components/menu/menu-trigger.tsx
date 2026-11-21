import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { useMenuContext } from "./menu-context.ts";

export interface MenuTriggerState {
    open: boolean;
    disabled: boolean;
}

export interface MenuTriggerProps extends PartProps<MenuTriggerState> {
    disabled?: boolean;
}

/** Opens the root menu (spec/menu.md, "Keyboard": on the Trigger). */
export function MenuTrigger(props: MenuTriggerProps) {
    const context = useMenuContext("Menu.Trigger");
    const state = () => ({
        open: context.open(),
        disabled: props.disabled ?? false,
    });
    const openWith = (
        highlight: "first" | "last",
        reason: "trigger-press" | "list-navigation",
    ) => {
        context.pendingHighlight.current = highlight;
        context.setOpen(true, reason);
    };
    return renderPart(
        "button",
        props,
        state,
        () => ({
            type: "button",
            id: context.triggerId,
            disabled: state().disabled,
            "aria-haspopup": "menu",
            "aria-expanded": String(context.open()),
            "aria-controls": context.open() ? context.popupId : undefined,
            "data-menu-part": "trigger",
            ...stateAttributes(state()),
            onClick: () => {
                context.pendingHighlight.current = null;
                context.setOpen(!context.open(), "trigger-press");
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
        }),
        { ref: context.setTrigger, omit: ["disabled"] },
    );
}
