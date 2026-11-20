import { defineClosePart } from "../shared/labelled-part.ts";
import { DialogKey } from "./dialog-context.ts";

/** Closes the dialog (reason `close-press`). */
export const DialogClose = defineClosePart(
    "DialogClose",
    DialogKey,
    "data-dialog-part",
);
