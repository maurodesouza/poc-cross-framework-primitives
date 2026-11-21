import type { Recipe } from "./recipe.ts";
import { FOCUS_RING } from "./shared.ts";

// spec/checkbox.md, "Anatomy"
export const checkbox: Recipe<"root" | "indicator"> = {
    root: `inline-flex size-4 shrink-0 items-center justify-center rounded-sm border border-palette-line bg-palette-base text-palette-base data-checked:border-palette-contrast data-checked:bg-palette-contrast data-indeterminate:border-palette-contrast data-indeterminate:bg-palette-contrast data-disabled:opacity-50 ${FOCUS_RING}`,
    indicator: "flex items-center justify-center text-xs leading-none",
};

export const checkboxGroup: Recipe<"root"> = {
    root: "flex flex-col items-start gap-2",
};
