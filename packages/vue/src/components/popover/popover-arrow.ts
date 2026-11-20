import { defineComponent } from "vue";
import { elementSetter } from "../../composables/use-overlay-root.ts";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { PopoverKey } from "./popover-context.ts";

/** Points at the anchor; placed along the popup's edge by the positioner. */
export const PopoverArrow = defineComponent({
    name: "PopoverArrow",
    inheritAttrs: false,
    props: asProp,
    setup(props, { attrs, slots }) {
        const context = useRequiredContext(PopoverKey, "Popover.Arrow");
        const setArrow = elementSetter(context.arrow);
        return () => {
            const placed = context.placed.value;
            return renderPart("div", { attrs, slots }, props.as, placed, {
                "aria-hidden": "true",
                "data-popover-part": "arrow",
                ...stateAttributes({ side: placed.side, align: placed.align }),
                ref: setArrow,
            });
        };
    },
});
