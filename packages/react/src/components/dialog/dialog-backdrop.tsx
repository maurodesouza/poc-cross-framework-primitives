import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { DialogContext } from "./dialog-context.ts";

export interface DialogBackdropState {
    open: boolean;
}

export function DialogBackdrop(props: PartProps<DialogBackdropState>) {
    const context = useRequiredContext(DialogContext, "Dialog.Backdrop");
    const status = context.presence.status;
    return renderElement(
        "div",
        props,
        { open: context.open },
        {
            "aria-hidden": "true",
            "data-dialog-part": "backdrop",
            ...stateAttributes({
                open: context.open,
                "starting-style": status === "starting",
                "ending-style": status === "ending",
            }),
        },
        context.setBackdrop,
    );
}
