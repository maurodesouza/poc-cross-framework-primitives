import { pushLayer } from "@poc/dom";
import { useEffect, useLayoutEffect } from "react";
import {
    type PositionerProps,
    usePositioner,
} from "../../hooks/use-positioner.ts";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { ComboboxContext } from "./combobox-context.ts";

export type ComboboxPositionerProps = PartProps<{
    open: boolean;
    side: string;
    align: string;
}> &
    PositionerProps;

/** Places the list under the input; the open list is a layer (Escape, outside press). */
export function ComboboxPositioner({
    side,
    align,
    sideOffset,
    alignOffset,
    collisionPadding,
    anchor,
    ...props
}: ComboboxPositionerProps) {
    const context = useRequiredContext(ComboboxContext, "Combobox.Positioner");
    const { open, positioner, trigger, button, setOpen, setPlaced } = context;
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
        const layer = pushLayer(positioner.ownerDocument, {
            elements: () => [positioner],
            ignore: () => [trigger, button],
            onEscape: () => setOpen(false, "escape-key"),
            onOutsidePress: () => setOpen(false, "outside-press"),
        });
        return () => layer.remove();
    }, [open, positioner, trigger, button, setOpen]);
    return renderElement(
        "div",
        props,
        { open, ...placed },
        {
            role: "presentation",
            "data-combobox-part": "positioner",
            ...stateAttributes({
                open,
                side: placed.side,
                align: placed.align,
            }),
        },
        context.setPositioner,
    );
}
