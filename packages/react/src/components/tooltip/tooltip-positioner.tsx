import { useLayoutEffect } from "react";
import {
    type PositionerProps,
    usePositioner,
} from "../../hooks/use-positioner.ts";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { TooltipContext } from "./tooltip-context.ts";

export interface TooltipPositionerState {
    open: boolean;
    side: string;
    align: string;
}

export type TooltipPositionerProps = PartProps<TooltipPositionerState> &
    PositionerProps;

/** Places the popup next to its anchor (spec/tooltip.md, "Positioning"). */
export function TooltipPositioner({
    side,
    align,
    sideOffset,
    alignOffset,
    collisionPadding,
    anchor,
    ...props
}: TooltipPositionerProps) {
    const context = useRequiredContext(TooltipContext, "Tooltip.Positioner");
    const placed = usePositioner(
        { side, align, sideOffset, alignOffset, collisionPadding, anchor },
        { side: "top", align: "center" },
        context.trigger,
        context.positioner,
        context.arrow,
    );
    const { setPlaced } = context;
    useLayoutEffect(() => setPlaced(placed), [placed, setPlaced]);
    const state = { open: context.open, ...placed };
    return renderElement(
        "div",
        props,
        state,
        {
            role: "presentation",
            "data-tooltip-part": "positioner",
            ...stateAttributes({
                open: context.open,
                side: placed.side,
                align: placed.align,
            }),
        },
        context.setPositioner,
    );
}
