import { useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { PopoverContext } from "./popover-context.ts";

/** Points at the anchor; placed along the popup's edge by the positioner. */
export function PopoverArrow(
    props: PartProps<{ side: string; align: string }>,
) {
    const context = useContext(PopoverContext);
    return renderPart(
        "div",
        props,
        context.placed,
        () => ({
            "aria-hidden": "true",
            "data-popover-part": "arrow",
            ...stateAttributes({ ...context.placed() }),
        }),
        { ref: context.setArrow },
    );
}
