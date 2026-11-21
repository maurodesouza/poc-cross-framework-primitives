import { openOverlaySession } from "@poc/dom";
import { useEffect, useLayoutEffect } from "react";
import {
    type PositionerProps,
    usePositioner,
} from "../../hooks/use-positioner.ts";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { SelectContext } from "./select-context.ts";

export type SelectPositionerProps = PartProps<{
    open: boolean;
    side: string;
    align: string;
}> &
    PositionerProps;

/**
 * Places the list below the trigger (spec/select.md, "Item alignment"); the open list is a layer
 * (Escape, outside press).
 */
export function SelectPositioner({
    side,
    align,
    sideOffset = 4,
    alignOffset,
    collisionPadding,
    anchor,
    ...props
}: SelectPositionerProps) {
    const context = useRequiredContext(SelectContext, "Select.Positioner");
    const { open, positioner, trigger, setOpen, setPlaced } = context;
    const placed = usePositioner(
        { side, align, sideOffset, alignOffset, collisionPadding, anchor },
        { side: "bottom", align: "start" },
        trigger,
        positioner,
        null,
    );
    useLayoutEffect(() => setPlaced(placed), [placed, setPlaced]);
    useEffect(() => {
        if (!open || positioner === null) {
            return undefined;
        }
        const session = openOverlaySession(positioner.ownerDocument, {
            elements: () => [positioner],
            ignore: () => [trigger],
            dismiss: (reason) => setOpen(false, reason),
        });
        return session.end;
    }, [open, positioner, trigger, setOpen]);
    return renderElement(
        "div",
        props,
        { open, ...placed },
        {
            role: "presentation",
            "data-select-part": "positioner",
            ...stateAttributes({
                open,
                side: placed.side,
                align: placed.align,
            }),
        },
        context.setPositioner,
    );
}
