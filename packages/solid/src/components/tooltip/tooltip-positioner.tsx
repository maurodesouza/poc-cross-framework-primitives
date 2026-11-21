import { useContext } from "solid-js";
import {
    createPositioner,
    POSITIONER_KEYS,
    type PositionerProps,
} from "../../hooks/create-positioner.ts";
import { type PartProps, renderPart } from "../../utils/part.tsx";
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
export function TooltipPositioner(props: TooltipPositionerProps) {
    const context = useContext(TooltipContext);
    const placed = createPositioner(
        props,
        { side: "top", align: "center" },
        {
            anchor: context.trigger,
            positioner: context.positioner,
            arrow: context.arrow,
        },
        context.setPlaced,
    );
    const state = () => ({ open: context.open(), ...placed() });
    return renderPart(
        "div",
        props,
        state,
        () => ({
            role: "presentation",
            "data-tooltip-part": "positioner",
            ...stateAttributes(state()),
        }),
        { ref: context.setPositioner, omit: POSITIONER_KEYS },
    );
}
