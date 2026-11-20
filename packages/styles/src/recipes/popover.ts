import type { Recipe } from "./recipe.ts";
import { BUTTON, FLOATING_BOX, FOCUS_RING } from "./shared.ts";

// spec/popover.md, "Anatomy"
export const popover: Recipe<
    | "trigger"
    | "positioner"
    | "popup"
    | "arrow"
    | "title"
    | "description"
    | "close"
> = {
    trigger: BUTTON,
    positioner: "z-50",
    popup: `${FLOATING_BOX} relative w-72 flex flex-col gap-2 p-4 ${FOCUS_RING}`,
    arrow: "size-2.5 rotate-45 bg-palette-base border-palette-line data-[side=bottom]:border-t data-[side=bottom]:border-s data-[side=top]:border-b data-[side=top]:border-e data-[side=start]:border-t data-[side=start]:border-e data-[side=end]:border-b data-[side=end]:border-s",
    title: "text-sm font-semibold",
    description: "text-sm text-palette-accent/85",
    close: BUTTON,
};
