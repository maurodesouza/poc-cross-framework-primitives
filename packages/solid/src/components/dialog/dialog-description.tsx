import { useContext } from "solid-js";
import { createLabelId } from "../../hooks/create-label-id.ts";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { DialogContext } from "./dialog-context.ts";

/** Describes the dialog (its id becomes the popup's `aria-describedby`). */
export function DialogDescription(props: PartProps<Record<string, never>>) {
    const context = useContext(DialogContext);
    const id = createLabelId(props, context.setDescriptionId);
    return renderPart(
        "p",
        props,
        () => ({}),
        () => ({
            id: id(),
            "data-dialog-part": "description",
        }),
    );
}
