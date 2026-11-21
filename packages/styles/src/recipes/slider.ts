import type { Recipe } from "./recipe.ts";
import { FOCUS_RING } from "./shared.ts";

// spec/slider.md, "Anatomy". The Control is 200 px long (w-50 / h-50), as the scenarios expect.
export const slider: Recipe<
    "root" | "control" | "track" | "indicator" | "thumb"
> = {
    root: "inline-flex data-disabled:opacity-50",
    control:
        "relative flex h-6 w-50 select-none items-center data-[orientation=vertical]:h-50 data-[orientation=vertical]:w-6 data-[orientation=vertical]:justify-center",
    track: "absolute start-0 end-0 h-1 rounded-full bg-palette-soft data-[orientation=vertical]:start-auto data-[orientation=vertical]:end-auto data-[orientation=vertical]:top-0 data-[orientation=vertical]:bottom-0 data-[orientation=vertical]:h-auto data-[orientation=vertical]:w-1",
    indicator:
        "rounded-full bg-palette-contrast data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
    thumb: `size-4 rounded-full border border-palette-contrast bg-palette-base shadow-sm data-disabled:opacity-50 ${FOCUS_RING}`,
};
