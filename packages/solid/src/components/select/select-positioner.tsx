import { openOverlaySession } from "@poc/dom";
import { createEffect, useContext } from "solid-js";
import {
    createPositioner,
    POSITIONER_KEYS,
    type PositionerProps,
} from "../../hooks/create-positioner.ts";
import { type PartProps, renderPart } from "../../utils/part.tsx";
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
export function SelectPositioner(props: SelectPositionerProps) {
    const context = useContext(SelectContext);
    const placed = createPositioner(
        {
            get side() {
                return props.side;
            },
            get align() {
                return props.align;
            },
            get sideOffset() {
                return props.sideOffset ?? 4;
            },
            get alignOffset() {
                return props.alignOffset;
            },
            get collisionPadding() {
                return props.collisionPadding;
            },
            get anchor() {
                return props.anchor;
            },
        },
        { side: "bottom", align: "start" },
        { anchor: context.trigger, positioner: context.positioner },
        context.setPlaced,
    );
    createEffect(
        () => ({
            open: context.open(),
            positioner: context.positioner(),
            trigger: context.trigger(),
        }),
        ({ open, positioner, trigger }) => {
            if (!open || positioner === null) {
                return undefined;
            }
            const session = openOverlaySession(positioner.ownerDocument, {
                elements: () => [positioner],
                ignore: () => [trigger],
                dismiss: (reason) => context.setOpen(false, reason),
            });
            return session.end;
        },
    );
    const state = () => ({ open: context.open(), ...placed() });
    return renderPart(
        "div",
        props,
        state,
        () => ({
            role: "presentation",
            "data-select-part": "positioner",
            ...stateAttributes(state()),
        }),
        { ref: context.setPositioner, omit: POSITIONER_KEYS },
    );
}
