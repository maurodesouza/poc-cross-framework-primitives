import type { Recipe } from "./recipe.ts";
import { BUTTON } from "./shared.ts";

// spec/tooltip.md, "Anatomy"
export const tooltip: Recipe<"trigger" | "positioner" | "popup" | "arrow"> = {
    trigger: BUTTON,
    positioner: "z-50",
    popup: "relative rounded-md bg-palette-contrast px-2 py-1 text-xs text-palette-base shadow-md origin-(--transform-origin) transition-[opacity,scale] duration-150 data-starting-style:opacity-0 data-starting-style:scale-95 data-ending-style:opacity-0 data-instant:transition-none",
    arrow: "size-2 rotate-45 bg-palette-contrast",
};
