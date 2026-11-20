import type { Recipe } from "./recipe.ts";
import { BUTTON, FLOATING_BOX, LIST_ITEM } from "./shared.ts";

// spec/menu.md, "Anatomy"
export const menu: Recipe<
    | "trigger"
    | "positioner"
    | "popup"
    | "item"
    | "separator"
    | "group"
    | "group-label"
    | "submenu-trigger"
> = {
    trigger: `${BUTTON} data-open:bg-palette-soft`,
    positioner: "z-50",
    popup: `${FLOATING_BOX} min-w-40 p-1 outline-none`,
    item: LIST_ITEM,
    separator: "-mx-1 my-1 h-px bg-palette-line",
    group: "flex flex-col",
    "group-label": "px-2 py-1.5 text-xs font-medium text-palette-accent/85",
    "submenu-trigger": `${LIST_ITEM} justify-between data-open:bg-palette-soft after:content-['›'] after:text-palette-accent/85 rtl:after:content-['‹']`,
};
