import { useLayoutEffect } from "react";
import {
    type PositionerProps,
    usePositioner,
} from "../../hooks/use-positioner.ts";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { MenuContext } from "./menu-context.ts";

export type MenuPositionerProps = PartProps<{
    open: boolean;
    side: string;
    align: string;
}> &
    PositionerProps;

/** Places a menu level: below its trigger, or at the end side of its submenu trigger. */
export function MenuPositioner({
    side,
    align,
    sideOffset,
    alignOffset,
    collisionPadding,
    anchor,
    ...props
}: MenuPositionerProps) {
    const context = useRequiredContext(MenuContext, "Menu.Positioner");
    const nested = context.parent !== null;
    const placed = usePositioner(
        { side, align, sideOffset, alignOffset, collisionPadding, anchor },
        nested
            ? { side: "end", align: "start" }
            : { side: "bottom", align: "start" },
        context.trigger,
        context.positioner,
        null,
    );
    const { setPlaced } = context;
    useLayoutEffect(() => setPlaced(placed), [placed, setPlaced]);
    return renderElement(
        "div",
        props,
        { open: context.open, ...placed },
        {
            role: "presentation",
            "data-menu-part": "positioner",
            ...stateAttributes({
                open: context.open,
                side: placed.side,
                align: placed.align,
                nested,
            }),
        },
        context.setPositioner,
    );
}
