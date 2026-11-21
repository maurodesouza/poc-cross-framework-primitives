import { createSignal } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { createMenuItem } from "./create-menu-item.ts";
import { useMenuContext } from "./menu-context.ts";

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
export function MenuItem(props: MenuItemProps) {
    const context = useMenuContext("Menu.Item");
    const [element, setElement] = createSignal<HTMLElement | null>(null);
    const item = createMenuItem(context, element, () => props.label, false);
    const disabled = () => props.disabled ?? false;
    const state = () => ({
        highlighted: item.highlighted(),
        disabled: disabled(),
    });
    return renderPart(
        "div",
        props,
        state,
        () => ({
            role: "menuitem",
            tabindex: -1,
            "aria-disabled": disabled() ? "true" : undefined,
            "data-menu-part": "item",
            ...stateAttributes(state()),
            ...item.handlers,
            onClick: (event: MouseEvent) => {
                // a disabled item is never activated: the consumer's handler does not run
                if (disabled()) {
                    return;
                }
                if (props.closeOnClick ?? true) {
                    context.closeAll("item-press");
                }
                (props.onClick as ((event: MouseEvent) => void) | undefined)?.(
                    event,
                );
            },
        }),
        {
            ref: (node) => setElement(node),
            omit: ["disabled", "label", "closeOnClick", "onClick"],
        },
    );
}
