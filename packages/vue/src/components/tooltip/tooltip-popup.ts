import { defineComponent } from "vue";
import { elementSetter } from "../../composables/use-overlay-root.ts";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { TooltipKey } from "./tooltip-context.ts";

/** The `tooltip`; never takes focus (spec/tooltip.md). */
export const TooltipPopup = defineComponent({
    name: "TooltipPopup",
    inheritAttrs: false,
    props: asProp,
    setup(props, { attrs, slots }) {
        const context = useRequiredContext(TooltipKey, "Tooltip.Popup");
        const setPopup = elementSetter(context.popup);
        return () => {
            const open = context.open.value;
            const instant = context.instant.value;
            const placed = context.placed.value;
            const status = context.presence.status.value;
            return renderPart(
                "div",
                { attrs, slots },
                props.as,
                { open, instant, ...placed },
                {
                    id: context.popupId,
                    role: "tooltip",
                    "data-tooltip-part": "popup",
                    ...stateAttributes({
                        open,
                        side: placed.side,
                        align: placed.align,
                        instant,
                        "starting-style": status === "starting",
                        "ending-style": status === "ending",
                    }),
                    ref: setPopup,
                },
            );
        };
    },
});
