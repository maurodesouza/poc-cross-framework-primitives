import { defineComponent, shallowRef } from "vue";
import { elementSetter } from "../../composables/use-overlay-root.ts";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { MenuKey } from "./menu-context.ts";
import { useMenuItem } from "./use-menu-item.ts";

/**
 * An action. Enter, Space and clicks fire its `click` (`@click`), then close every level
 * (spec/menu.md). A disabled item stays focusable but is never activated.
 */
export const MenuItem = defineComponent({
    name: "MenuItem",
    inheritAttrs: false,
    props: {
        ...asProp,
        disabled: { type: Boolean, default: false },
        /** The text typeahead matches (default: the item's text). */
        label: { type: String, default: undefined },
        /** Activating the item closes every menu level (default `true`). */
        closeOnClick: { type: Boolean, default: true },
    },
    setup(props, { attrs, slots }) {
        const context = useRequiredContext(MenuKey, "Menu.Item");
        const element = shallowRef<HTMLElement | null>(null);
        const setElement = elementSetter(element);
        const item = useMenuItem(context, element, () => props.label, false);
        return () => {
            const highlighted = item.highlighted.value;
            const { onClick, ...rest } = attrs;
            const consumer = props.disabled ? rest : attrs;
            void onClick;
            return renderPart(
                "div",
                { attrs: consumer, slots },
                props.as,
                { highlighted, disabled: props.disabled },
                {
                    role: "menuitem",
                    tabindex: -1,
                    "aria-disabled": props.disabled ? "true" : undefined,
                    "data-menu-part": "item",
                    ...stateAttributes({
                        highlighted,
                        disabled: props.disabled,
                    }),
                    ...item.handlers,
                    onClick: () => {
                        if (!props.disabled && props.closeOnClick) {
                            context.closeAll("item-press");
                        }
                    },
                    ref: setElement,
                },
            );
        };
    },
});
