import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { usePicker } from "./use-picker.ts";

/** Opens the picker; its content is the consumer's (for example the formatted value). */
export function DatePickerTrigger(props: PartProps<{ open: boolean }>) {
    const context = usePicker("DatePicker.Trigger");
    const state = () => ({ open: context.open() });
    return renderPart(
        "button",
        props,
        state,
        () => ({
            type: "button",
            id: context.triggerId,
            "aria-haspopup": "dialog",
            "aria-expanded": String(context.open()),
            "aria-controls": context.open() ? context.popupId : undefined,
            "data-date-picker-part": "trigger",
            ...stateAttributes(state()),
            onClick: () => context.setOpen(!context.open(), "trigger-press"),
        }),
        { ref: context.setTrigger },
    );
}
