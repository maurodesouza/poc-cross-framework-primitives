import type { Recipe } from "./recipe.ts";
import { FOCUS_RING } from "./shared.ts";

// spec/field.md, "Anatomy". Palette roles only: an invalid control gets a heavier border in the
// contrast role, and its error is set in a medium weight.
export const field: Recipe<
    "root" | "label" | "control" | "description" | "error"
> = {
    root: "flex flex-col items-start gap-1",
    label: "text-sm font-medium text-palette-contrast data-disabled:opacity-50",
    control: `h-9 w-56 px-3 rounded-md border border-palette-line bg-palette-base text-sm text-palette-contrast data-invalid:border-2 data-invalid:border-palette-contrast data-disabled:opacity-50 ${FOCUS_RING}`,
    description: "text-xs text-palette-accent data-disabled:opacity-50",
    error: "text-xs font-medium text-palette-contrast",
};
