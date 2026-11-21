import {
    createPositioner,
    POSITIONER_KEYS,
    type PositionerProps,
} from "../../hooks/create-positioner.ts";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { useMenuContext } from "./menu-context.ts";

export type MenuPositionerProps = PartProps<{
    open: boolean;
    side: string;
    align: string;
}> &
    PositionerProps;

/** Places a menu level: below its trigger, or at the end side of its submenu trigger. */
export function MenuPositioner(props: MenuPositionerProps) {
    const context = useMenuContext("Menu.Positioner");
    const nested = context.parent !== null;
    const placed = createPositioner(
        props,
        nested
            ? { side: "end", align: "start" }
            : { side: "bottom", align: "start" },
        { anchor: context.trigger, positioner: context.positioner },
        context.setPlaced,
    );
    const state = () => ({ open: context.open(), ...placed() });
    return renderPart(
        "div",
        props,
        state,
        () => ({
            role: "presentation",
            "data-menu-part": "positioner",
            ...stateAttributes({ ...state(), nested }),
        }),
        { ref: context.setPositioner, omit: POSITIONER_KEYS },
    );
}
