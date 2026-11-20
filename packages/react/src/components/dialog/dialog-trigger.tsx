import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { DialogContext } from "./dialog-context.ts";

export interface DialogTriggerState {
    open: boolean;
    disabled: boolean;
}

export interface DialogTriggerProps extends PartProps<DialogTriggerState> {
    disabled?: boolean;
}

export function DialogTrigger({
    disabled = false,
    ...props
}: DialogTriggerProps) {
    const context = useRequiredContext(DialogContext, "Dialog.Trigger");
    const state = { open: context.open, disabled };
    return renderElement(
        "button",
        props,
        state,
        {
            type: "button",
            id: context.triggerId,
            disabled,
            "aria-haspopup": "dialog",
            "aria-expanded": context.open,
            "aria-controls": context.open ? context.popupId : undefined,
            "data-dialog-part": "trigger",
            ...stateAttributes({ open: context.open, disabled }),
            onClick: () => context.setOpen(!context.open, "trigger-press"),
        },
        context.setTrigger,
    );
}
