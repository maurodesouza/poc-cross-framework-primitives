import type { Recipe } from "./recipe.ts";
import { FLOATING_BOX, LIST_ITEM } from "./shared.ts";

// spec/combobox.md, "Anatomy"
export const combobox: Recipe<
    "input" | "trigger" | "positioner" | "popup" | "list" | "item" | "empty"
> = {
    input: "h-9 w-56 px-3 rounded-md border border-palette-line bg-palette-base text-sm text-palette-contrast outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-ring data-disabled:opacity-50",
    trigger:
        "inline-flex size-9 items-center justify-center rounded-md text-palette-accent/85 hover:bg-palette-soft",
    positioner: "z-50",
    popup: `${FLOATING_BOX} w-(--anchor-width) min-w-56 max-h-(--available-height) overflow-y-auto p-1`,
    list: "flex flex-col outline-none data-empty:hidden",
    item: `${LIST_ITEM} data-selected:font-semibold`,
    empty: "px-2 py-3 text-sm text-palette-accent/85",
};
