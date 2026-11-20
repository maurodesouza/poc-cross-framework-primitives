import { defineLabelledPart } from "../shared/labelled-part.ts";
import { PopoverKey } from "./popover-context.ts";

export const PopoverTitle = defineLabelledPart(
    "PopoverTitle",
    PopoverKey,
    "h2",
    "data-popover-part",
    "title",
    (c) => c.titleId,
);
