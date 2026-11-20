import { defineLabelledPart } from "../shared/labelled-part.ts";
import { PopoverKey } from "./popover-context.ts";

export const PopoverDescription = defineLabelledPart(
    "PopoverDescription",
    PopoverKey,
    "p",
    "data-popover-part",
    "description",
    (c) => c.descriptionId,
);
