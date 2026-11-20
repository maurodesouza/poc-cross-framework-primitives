import { defineComponent } from "vue";
import { elementSetter } from "../../composables/use-overlay-root.ts";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { MenuKey } from "./menu-context.ts";

/** Opens the root menu (spec/menu.md, "Keyboard": on the Trigger). */
export const MenuTrigger = defineComponent({
    name: "MenuTrigger",
    inheritAttrs: false,
    props: { ...asProp, disabled: { type: Boolean, default: false } },
    setup(props, { attrs, slots }) {
        const context = useRequiredContext(MenuKey, "Menu.Trigger");
        const setTrigger = elementSetter(context.trigger);
        const openWith = (
            highlight: "first" | "last",
            reason: "trigger-press" | "list-navigation",
        ) => {
            context.pendingHighlight.current = highlight;
            context.setOpen(true, reason);
        };
        return () => {
            const open = context.open.value;
            return renderPart(
                "button",
                { attrs, slots },
                props.as,
                { open, disabled: props.disabled },
                {
                    type: "button",
                    id: context.triggerId,
                    disabled: props.disabled,
                    "aria-haspopup": "menu",
                    "aria-expanded": open ? "true" : "false",
                    "aria-controls": open ? context.popupId : undefined,
                    "data-menu-part": "trigger",
                    ...stateAttributes({ open, disabled: props.disabled }),
                    onClick: () => {
                        context.pendingHighlight.current = null;
                        context.setOpen(!open, "trigger-press");
                    },
                    onKeydown: (event: KeyboardEvent) => {
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
                    onKeyup: (event: KeyboardEvent) => {
                        if (event.key === " ") {
                            event.preventDefault();
                        }
                    },
                    ref: setTrigger,
                },
            );
        };
    },
});
