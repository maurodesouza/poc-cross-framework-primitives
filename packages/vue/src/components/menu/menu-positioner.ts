import { defineComponent, watch } from "vue";
import { elementSetter } from "../../composables/use-overlay-root.ts";
import {
    positionerProps,
    usePositioner,
} from "../../composables/use-positioner.ts";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { MenuKey } from "./menu-context.ts";

/** Places a menu level: below its trigger, or at the end side of its submenu trigger. */
export const MenuPositioner = defineComponent({
    name: "MenuPositioner",
    inheritAttrs: false,
    props: { ...asProp, ...positionerProps },
    setup(props, { attrs, slots }) {
        const context = useRequiredContext(MenuKey, "Menu.Positioner");
        const nested = context.parent !== null;
        const setPositioner = elementSetter(context.positioner);
        const placed = usePositioner(
            props,
            nested
                ? { side: "end", align: "start" }
                : { side: "bottom", align: "start" },
            context.trigger,
            context.positioner,
            null,
        );
        watch(placed, (value) => (context.placed.value = value), {
            immediate: true,
        });
        return () => {
            const open = context.open.value;
            return renderPart(
                "div",
                { attrs, slots },
                props.as,
                { open, ...placed.value },
                {
                    role: "presentation",
                    "data-menu-part": "positioner",
                    ...stateAttributes({
                        open,
                        side: placed.value.side,
                        align: placed.value.align,
                        nested,
                    }),
                    ref: setPositioner,
                },
            );
        };
    },
});
