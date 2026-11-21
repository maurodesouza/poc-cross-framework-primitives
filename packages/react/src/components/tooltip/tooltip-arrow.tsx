import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { TooltipContext } from "./tooltip-context.ts";

/** Points at the anchor; placed along the popup's edge by the positioner. */
export function TooltipArrow(
    props: PartProps<{ side: string; align: string }>,
) {
    const context = useRequiredContext(TooltipContext, "Tooltip.Arrow");
    return renderElement(
        "div",
        props,
        context.placed,
        {
            "aria-hidden": "true",
            "data-tooltip-part": "arrow",
            ...stateAttributes({
                side: context.placed.side,
                align: context.placed.align,
            }),
        },
        context.setArrow,
    );
}
