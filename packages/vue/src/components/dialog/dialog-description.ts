import { defineLabelledPart } from "../shared/labelled-part.ts";
import { DialogKey } from "./dialog-context.ts";

/** Describes the dialog (its id becomes the popup's `aria-describedby`). */
export const DialogDescription = defineLabelledPart(
    "DialogDescription",
    DialogKey,
    "p",
    "data-dialog-part",
    "description",
    (c) => c.descriptionId,
);
