import { useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { DialogContext } from "./dialog-context.ts";

/** Closes the dialog (reason `close-press`). */
export function DialogClose(props: PartProps<Record<string, never>>) {
    const context = useContext(DialogContext);
    return renderPart(
        "button",
        props,
        () => ({}),
        () => ({
            type: "button",
            "data-dialog-part": "close",
            onClick: () => context.setOpen(false, "close-press"),
        }),
    );
}
