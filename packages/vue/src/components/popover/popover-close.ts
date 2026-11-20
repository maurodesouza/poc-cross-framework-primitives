import { defineClosePart } from "../shared/labelled-part.ts";
import { PopoverKey } from "./popover-context.ts";

export const PopoverClose = defineClosePart(
    "PopoverClose",
    PopoverKey,
    "data-popover-part",
);
