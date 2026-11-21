import { defineComponent, watch } from "vue";
import { elementSetter } from "../../composables/use-overlay-root.ts";
import {
    positionerProps,
    usePositioner,
} from "../../composables/use-positioner.ts";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { TooltipKey } from "./tooltip-context.ts";

/** Places the popup next to its anchor (spec/tooltip.md, "Positioning"). */
export const TooltipPositioner = defineComponent({
    name: "TooltipPositioner",
    inheritAttrs: false,
    props: { ...asProp, ...positionerProps },
    setup(props, { attrs, slots }) {
        const context = useRequiredContext(TooltipKey, "Tooltip.Positioner");
        const setPositioner = elementSetter(context.positioner);
        const placed = usePositioner(
            props,
            { side: "top", align: "center" },
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
                    "data-tooltip-part": "positioner",
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
