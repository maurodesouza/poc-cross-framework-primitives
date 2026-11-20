import { useElement } from "../../hooks/use-element.ts";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { MenuContext } from "./menu-context.ts";
import { useMenuItem } from "./use-menu-item.ts";

export interface MenuItemState {
    highlighted: boolean;
    disabled: boolean;
}

export interface MenuItemProps extends PartProps<MenuItemState> {
    disabled?: boolean;
    /** The text typeahead matches (default: the item's text). */
    label?: string;
    /** Activating the item closes every menu level (default `true`). */
    closeOnClick?: boolean;
}

/**
 * An action. Enter, Space and clicks fire its `click`, then close every level (spec/menu.md).
 * A disabled item stays focusable but is never activated.
 */
export function MenuItem({
    disabled = false,
    label,
    closeOnClick = true,
    onClick,
    ...props
}: MenuItemProps) {
    const context = useRequiredContext(MenuContext, "Menu.Item");
    const [element, ref] = useElement<HTMLElement>();
    const item = useMenuItem(context, element, label, false);
    const state = { highlighted: item.highlighted, disabled };
    const consumer = disabled ? props : { ...props, onClick };
    return renderElement(
        "div",
        consumer,
        state,
        {
            role: "menuitem",
            tabIndex: -1,
            "aria-disabled": disabled ? "true" : undefined,
            "data-menu-part": "item",
            ...stateAttributes({ highlighted: item.highlighted, disabled }),
            ...item.handlers,
            onClick: () => {
                if (!disabled && closeOnClick) {
                    context.closeAll("item-press");
                }
            },
        },
        ref,
    );
}
