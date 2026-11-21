import { useContext } from "solid-js";
import {
    createPositioner,
    POSITIONER_KEYS,
    type PositionerProps,
} from "../../hooks/create-positioner.ts";
import { type PartProps, renderPart } from "../../utils/part.tsx";
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
export function PopoverPositioner(props: PopoverPositionerProps) {
    const context = useContext(PopoverContext);
    const placed = createPositioner(
        props,
        { side: "bottom", align: "center" },
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
            "data-popover-part": "positioner",
            ...stateAttributes(state()),
        }),
        { ref: context.setPositioner, omit: POSITIONER_KEYS },
    );
}
