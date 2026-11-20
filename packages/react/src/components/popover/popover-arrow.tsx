import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { PopoverContext } from "./popover-context.ts";

/** Points at the anchor; placed along the popup's edge by the positioner. */
export function PopoverArrow(
    props: PartProps<{ side: string; align: string }>,
) {
    const context = useRequiredContext(PopoverContext, "Popover.Arrow");
    return renderElement(
        "div",
        props,
        context.placed,
        {
            "aria-hidden": "true",
            "data-popover-part": "arrow",
            ...stateAttributes({
                side: context.placed.side,
                align: context.placed.align,
            }),
        },
        context.setArrow,
    );
}
