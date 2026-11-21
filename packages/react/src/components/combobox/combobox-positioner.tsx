import { openOverlaySession } from "@poc/dom";
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

/**
 * Places the list under the InputGroup (else the Chips, else the Input); the open list is a layer
 * (Escape, outside press).
 */
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
    const {
        open,
        positioner,
        trigger,
        button,
        inputGroup,
        chips,
        clearButton,
        setOpen,
        setPlaced,
    } = context;
    const placed = usePositioner(
        { side, align, sideOffset, alignOffset, collisionPadding, anchor },
        { side: "bottom", align: "start" },
        inputGroup ?? chips ?? trigger,
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
            ignore: () => [trigger, button, inputGroup, chips, clearButton],
            dismiss: (reason) => setOpen(false, reason),
        });
        return session.end;
    }, [
        open,
        positioner,
        trigger,
        button,
        inputGroup,
        chips,
        clearButton,
        setOpen,
    ]);
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
