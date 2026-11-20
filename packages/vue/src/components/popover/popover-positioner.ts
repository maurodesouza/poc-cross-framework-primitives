import { defineComponent, watch } from "vue";
import { elementSetter } from "../../composables/use-overlay-root.ts";
import {
    positionerProps,
    usePositioner,
} from "../../composables/use-positioner.ts";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { PopoverKey } from "./popover-context.ts";

/** Places the popup next to its anchor (spec/popover.md, "Positioning"). */
export const PopoverPositioner = defineComponent({
    name: "PopoverPositioner",
    inheritAttrs: false,
    props: { ...asProp, ...positionerProps },
    setup(props, { attrs, slots }) {
        const context = useRequiredContext(PopoverKey, "Popover.Positioner");
        const setPositioner = elementSetter(context.positioner);
        const placed = usePositioner(
            props,
            { side: "bottom", align: "center" },
            context.trigger,
            context.positioner,
            context.arrow,
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
                    "data-popover-part": "positioner",
                    ...stateAttributes({
                        open,
                        side: placed.value.side,
                        align: placed.value.align,
                    }),
                    ref: setPositioner,
                },
            );
        };
    },
});
