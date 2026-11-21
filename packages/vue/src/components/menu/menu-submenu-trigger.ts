import { getDirection, submenuKeys } from "@poc/dom";
import { defineComponent, onBeforeUnmount, shallowRef } from "vue";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { MenuKey } from "./menu-context.ts";
import { useMenuItem } from "./use-menu-item.ts";

/** An item of the parent menu that opens its submenu (spec/menu.md). */
export const MenuSubmenuTrigger = defineComponent({
    name: "MenuSubmenuTrigger",
    inheritAttrs: false,
    props: {
        ...asProp,
        disabled: { type: Boolean, default: false },
        label: { type: String, default: undefined },
        /** Hovering opens the submenu (default `true`), after `delay` ms (default 100). */
        openOnHover: { type: Boolean, default: true },
        delay: { type: Number, default: 100 },
    },
    setup(props, { attrs, slots }) {
        const submenu = useRequiredContext(MenuKey, "Menu.SubmenuTrigger");
        const parent = submenu.parent;
        if (parent === null) {
            throw new Error(
                "<Menu.SubmenuTrigger> must be inside <Menu.SubmenuRoot>.",
            );
        }
        const element = shallowRef<HTMLElement | null>(null);
        const item = useMenuItem(parent, element, () => props.label, true);
        let timer: ReturnType<typeof setTimeout> | undefined;
        onBeforeUnmount(() => clearTimeout(timer));
        const setElement = (value: unknown) => {
            const node = value instanceof HTMLElement ? value : null;
            element.value = node;
            submenu.trigger.value = node;
        };
        const open = (
            highlight: "first" | null,
            reason: "trigger-press" | "list-navigation",
        ) => {
            if (props.disabled) {
                return;
            }
            submenu.pendingHighlight.current = highlight;
            submenu.setOpen(true, reason);
        };
        return () => {
            const isOpen = submenu.open.value;
            const highlighted = item.highlighted.value;
            return renderPart(
                "div",
                { attrs, slots },
                props.as,
                { open: isOpen, highlighted, disabled: props.disabled },
                {
                    id: submenu.triggerId,
                    role: "menuitem",
                    tabindex: -1,
                    "aria-haspopup": "menu",
                    "aria-expanded": isOpen ? "true" : "false",
                    "aria-controls": isOpen ? submenu.popupId : undefined,
                    "aria-disabled": props.disabled ? "true" : undefined,
                    "data-menu-part": "submenu-trigger",
                    ...stateAttributes({
                        open: isOpen,
                        highlighted,
                        disabled: props.disabled,
                    }),
                    onFocus: item.handlers.onFocus,
                    onBlur: item.handlers.onBlur,
                    onClick: () => open(null, "trigger-press"),
                    onKeydown: (event: KeyboardEvent) => {
                        const node = element.value;
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
                    onPointermove: (event: PointerEvent) => {
                        item.handlers.onPointermove(event);
                        if (
                            props.openOnHover &&
                            !submenu.open.value &&
                            timer === undefined
                        ) {
                            timer = setTimeout(() => {
                                timer = undefined;
                                open(null, "trigger-press");
                            }, props.delay);
                        }
                    },
                    onPointerleave: (event: PointerEvent) => {
                        clearTimeout(timer);
                        timer = undefined;
                        const popup = submenu.popup.value;
                        if (submenu.open.value && popup) {
                            parent.safeArea.current = {
                                x: event.clientX,
                                y: event.clientY,
                                submenu: popup,
                            };
                        }
                    },
                    ref: setElement,
                },
            );
        };
    },
});
