import {
    createPositioner,
    POSITIONER_KEYS,
    type PositionerProps,
} from "../../hooks/create-positioner.ts";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { usePicker } from "./use-picker.ts";

export type DatePickerPositionerProps = PartProps<{
    open: boolean;
    side: string;
    align: string;
}> &
    PositionerProps;

export function DatePickerPositioner(props: DatePickerPositionerProps) {
    const context = usePicker("DatePicker.Positioner");
    const placed = createPositioner(
        props,
        { side: "bottom", align: "start" },
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
            "data-date-picker-part": "positioner",
            ...stateAttributes(state()),
        }),
        { ref: context.setPositioner, omit: POSITIONER_KEYS },
    );
}
