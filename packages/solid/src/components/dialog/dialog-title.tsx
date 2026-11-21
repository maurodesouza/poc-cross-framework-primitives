import { useContext } from "solid-js";
import { createLabelId } from "../../hooks/create-label-id.ts";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { DialogContext } from "./dialog-context.ts";

/** Names the dialog (its id becomes the popup's `aria-labelledby`). */
export function DialogTitle(props: PartProps<Record<string, never>>) {
    const context = useContext(DialogContext);
    const id = createLabelId(props, context.setTitleId);
    return renderPart(
        "h2",
        props,
        () => ({}),
        () => ({
            id: id(),
            "data-dialog-part": "title",
        }),
    );
}
