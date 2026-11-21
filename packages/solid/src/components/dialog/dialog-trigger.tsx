import { useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { DialogContext } from "./dialog-context.ts";

export interface DialogTriggerState {
    open: boolean;
    disabled: boolean;
}

export interface DialogTriggerProps extends PartProps<DialogTriggerState> {
    disabled?: boolean;
}

export function DialogTrigger(props: DialogTriggerProps) {
    const context = useContext(DialogContext);
    const state = () => ({
        open: context.open(),
        disabled: props.disabled ?? false,
    });
    return renderPart(
        "button",
        props,
        state,
        () => ({
            type: "button",
            id: context.triggerId,
            disabled: state().disabled,
            "aria-haspopup": "dialog",
            "aria-expanded": String(context.open()),
            "aria-controls": context.open() ? context.popupId : undefined,
            "data-dialog-part": "trigger",
            ...stateAttributes(state()),
            onClick: () => context.setOpen(!context.open(), "trigger-press"),
        }),
        { ref: context.setTrigger, omit: ["disabled"] },
    );
}
