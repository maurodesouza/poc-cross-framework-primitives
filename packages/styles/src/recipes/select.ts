import type { Recipe } from "./recipe.ts";
import { BUTTON, FLOATING_BOX, LIST_ITEM } from "./shared.ts";

// spec/select.md, "Anatomy"
export const select: Recipe<
    | "trigger"
    | "value"
    | "positioner"
    | "popup"
    | "list"
    | "item"
    | "item-indicator"
> = {
    trigger: `${BUTTON.replace("justify-center", "justify-between")} min-w-48 data-open:bg-palette-soft data-invalid:border-2 data-invalid:border-palette-contrast`,
    value: "truncate data-placeholder:text-palette-accent/85",
    positioner: "z-50",
    // no padding of its own: the list's box starts at the popup's
    popup: `${FLOATING_BOX} min-w-(--anchor-width) max-h-(--available-height) overflow-y-auto`,
    list: "flex flex-col p-1 outline-none",
    item: `${LIST_ITEM} justify-between data-selected:font-semibold`,
    "item-indicator": "text-xs",
};
