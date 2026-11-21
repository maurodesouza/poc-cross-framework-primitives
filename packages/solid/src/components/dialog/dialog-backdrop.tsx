import { useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { DialogContext } from "./dialog-context.ts";

export interface DialogBackdropState {
    open: boolean;
}

export function DialogBackdrop(props: PartProps<DialogBackdropState>) {
    const context = useContext(DialogContext);
    const state = () => ({ open: context.open() });
    return renderPart(
        "div",
        props,
        state,
        () => ({
            "aria-hidden": "true",
            "data-dialog-part": "backdrop",
            ...stateAttributes({
                open: context.open(),
                "starting-style": context.presence.status() === "starting",
                "ending-style": context.presence.status() === "ending",
            }),
        }),
        { ref: context.setBackdrop },
    );
}
