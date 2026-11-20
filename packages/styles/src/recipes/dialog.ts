import type { Recipe } from "./recipe.ts";
import { BUTTON, FOCUS_RING } from "./shared.ts";

// spec/dialog.md, "Anatomy"
export const dialog: Recipe<
    "trigger" | "backdrop" | "popup" | "title" | "description" | "close"
> = {
    trigger: BUTTON,
    backdrop:
        "fixed inset-0 bg-black/40 transition-opacity duration-150 data-starting-style:opacity-0 data-ending-style:opacity-0",
    popup: `palette-raised fixed top-1/2 start-1/2 -translate-y-1/2 -translate-x-1/2 rtl:translate-x-1/2 w-96 max-w-[calc(100vw-2rem)] flex flex-col gap-3 p-6 rounded-xl border border-palette-line bg-palette-base text-palette-contrast shadow-xl transition-[opacity,scale] duration-150 data-starting-style:opacity-0 data-starting-style:scale-95 data-ending-style:opacity-0 data-ending-style:scale-95 ${FOCUS_RING}`,
    title: "text-lg font-semibold",
    description: "text-sm text-palette-accent/85",
    close: BUTTON,
};
