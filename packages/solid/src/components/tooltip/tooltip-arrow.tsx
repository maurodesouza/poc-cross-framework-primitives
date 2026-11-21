import { useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { TooltipContext } from "./tooltip-context.ts";

/** Points at the anchor; placed along the popup's edge by the positioner. */
export function TooltipArrow(
    props: PartProps<{ side: string; align: string }>,
) {
    const context = useContext(TooltipContext);
    return renderPart(
        "div",
        props,
        context.placed,
        () => ({
            "aria-hidden": "true",
            "data-tooltip-part": "arrow",
            ...stateAttributes({ ...context.placed() }),
        }),
        { ref: context.setArrow },
    );
}
