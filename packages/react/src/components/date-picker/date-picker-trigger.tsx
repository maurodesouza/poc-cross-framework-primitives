import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { DatePickerContext } from "./date-picker-context.ts";

/** Opens the picker; its content is the consumer's (for example the formatted value). */
export function DatePickerTrigger(props: PartProps<{ open: boolean }>) {
    const context = useRequiredContext(DatePickerContext, "DatePicker.Trigger");
    return renderElement(
        "button",
        props,
        { open: context.open },
        {
            type: "button",
            id: context.triggerId,
            "aria-haspopup": "dialog",
            "aria-expanded": context.open,
            "aria-controls": context.open ? context.popupId : undefined,
            "data-date-picker-part": "trigger",
            ...stateAttributes({ open: context.open }),
            onClick: () => context.setOpen(!context.open, "trigger-press"),
        },
        context.setTrigger,
    );
}
