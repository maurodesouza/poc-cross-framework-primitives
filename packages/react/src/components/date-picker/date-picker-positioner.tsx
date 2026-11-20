import { useLayoutEffect } from "react";
import {
    type PositionerProps,
    usePositioner,
} from "../../hooks/use-positioner.ts";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { DatePickerContext } from "./date-picker-context.ts";

export type DatePickerPositionerProps = PartProps<{
    open: boolean;
    side: string;
    align: string;
}> &
    PositionerProps;

export function DatePickerPositioner({
    side,
    align,
    sideOffset,
    alignOffset,
    collisionPadding,
    anchor,
    ...props
}: DatePickerPositionerProps) {
    const context = useRequiredContext(
        DatePickerContext,
        "DatePicker.Positioner",
    );
    const placed = usePositioner(
        { side, align, sideOffset, alignOffset, collisionPadding, anchor },
        { side: "bottom", align: "start" },
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
            "data-date-picker-part": "positioner",
            ...stateAttributes({
                open: context.open,
                side: placed.side,
                align: placed.align,
            }),
        },
        context.setPositioner,
    );
}
