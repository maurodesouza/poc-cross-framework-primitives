import { defineLabelledPart } from "../shared/labelled-part.ts";
import { DialogKey } from "./dialog-context.ts";

/** Names the dialog (its id becomes the popup's `aria-labelledby`). */
export const DialogTitle = defineLabelledPart(
    "DialogTitle",
    DialogKey,
    "h2",
    "data-dialog-part",
    "title",
    (c) => c.titleId,
);
