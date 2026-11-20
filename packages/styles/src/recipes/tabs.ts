import type { Recipe } from "./recipe.ts";
import { FOCUS_RING } from "./shared.ts";

// spec/tabs.md, "Anatomy"
export const tabs: Recipe<"root" | "list" | "tab" | "indicator" | "panel"> = {
    root: "flex flex-col gap-3 data-[orientation=vertical]:flex-row",
    list: "relative flex gap-1 border-b border-palette-line data-[orientation=vertical]:flex-col data-[orientation=vertical]:border-b-0 data-[orientation=vertical]:border-e",
    tab: `h-9 px-3 text-sm font-medium text-palette-accent/85 rounded-md hover:text-palette-contrast data-selected:text-palette-contrast data-disabled:opacity-50 ${FOCUS_RING}`,
    indicator:
        "absolute start-(--tabs-indicator-inset-inline-start) bottom-0 h-0.5 w-(--tabs-indicator-inline-size) bg-palette-ring transition-[inset-inline-start,width] duration-200 data-[orientation=vertical]:start-auto data-[orientation=vertical]:end-0 data-[orientation=vertical]:bottom-auto data-[orientation=vertical]:top-(--tabs-indicator-inset-block-start) data-[orientation=vertical]:h-(--tabs-indicator-block-size) data-[orientation=vertical]:w-0.5",
    panel: `text-sm ${FOCUS_RING} rounded-md`,
};
