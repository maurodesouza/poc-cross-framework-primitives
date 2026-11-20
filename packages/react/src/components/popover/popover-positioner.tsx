import { useLayoutEffect } from "react";
import {
    type PositionerProps,
    usePositioner,
} from "../../hooks/use-positioner.ts";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { PopoverContext } from "./popover-context.ts";

export interface PopoverPositionerState {
    open: boolean;
    side: string;
    align: string;
}

export type PopoverPositionerProps = PartProps<PopoverPositionerState> &
    PositionerProps;

/** Places the popup next to its anchor (spec/popover.md, "Positioning"). */
export function PopoverPositioner({
    side,
    align,
    sideOffset,
    alignOffset,
    collisionPadding,
    anchor,
    ...props
}: PopoverPositionerProps) {
    const context = useRequiredContext(PopoverContext, "Popover.Positioner");
    const placed = usePositioner(
        { side, align, sideOffset, alignOffset, collisionPadding, anchor },
        { side: "bottom", align: "center" },
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
            "data-popover-part": "positioner",
            ...stateAttributes({
                open: context.open,
                side: placed.side,
                align: placed.align,
            }),
        },
        context.setPositioner,
    );
}
