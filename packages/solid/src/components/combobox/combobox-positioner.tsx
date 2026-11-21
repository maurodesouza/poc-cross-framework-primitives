import { openOverlaySession } from "@poc/dom";
import { createEffect, useContext } from "solid-js";
import {
    createPositioner,
    POSITIONER_KEYS,
    type PositionerProps,
} from "../../hooks/create-positioner.ts";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { ComboboxContext } from "./combobox-context.ts";

export type ComboboxPositionerProps = PartProps<{
    open: boolean;
    side: string;
    align: string;
}> &
    PositionerProps;

/** Places the list under the input; the open list is a layer (Escape, outside press). */
export function ComboboxPositioner(props: ComboboxPositionerProps) {
    const context = useContext(ComboboxContext);
    const placed = createPositioner(
        props,
        { side: "bottom", align: "start" },
        { anchor: context.trigger, positioner: context.positioner },
        context.setPlaced,
    );
    createEffect(
        () => ({
            open: context.open(),
            positioner: context.positioner(),
            trigger: context.trigger(),
            button: context.button(),
        }),
        ({ open, positioner, trigger, button }) => {
            if (!open || positioner === null) {
                return undefined;
            }
            const session = openOverlaySession(positioner.ownerDocument, {
                elements: () => [positioner],
                ignore: () => [trigger, button],
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
            "data-combobox-part": "positioner",
            ...stateAttributes(state()),
        }),
        { ref: context.setPositioner, omit: POSITIONER_KEYS },
    );
}
