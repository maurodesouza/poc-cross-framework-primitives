import type { Recipe } from "./recipe.ts";
import { BUTTON, FLOATING_BOX, FOCUS_RING } from "./shared.ts";

// spec/calendar.md, "Anatomy" (Calendar and RangeCalendar share the parts). The look follows
// Untitled UI's date picker cell: round days, a dot under today, ranges rounded at their ends.
export const calendar: Recipe<
    | "root"
    | "heading"
    | "prev-button"
    | "next-button"
    | "grid"
    | "grid-header"
    | "header-cell"
    | "grid-body"
    | "row"
    | "cell"
> = {
    root: "inline-flex flex-col gap-3 text-palette-contrast",
    heading: "text-sm font-semibold text-center",
    "prev-button": `${BUTTON} size-8 px-0`,
    "next-button": `${BUTTON} size-8 px-0`,
    grid: "border-collapse",
    "grid-header": "",
    "header-cell": "size-10 p-0 text-xs font-medium text-palette-accent/85",
    "grid-body": "",
    row: "",
    cell: `relative size-10 p-0 text-center text-sm cursor-default select-none rounded-full ${FOCUS_RING} hover:bg-palette-soft data-today:font-semibold data-today:after:absolute data-today:after:bottom-1 data-today:after:start-1/2 data-today:after:size-1 data-today:after:-translate-x-1/2 data-today:after:rounded-full data-today:after:bg-palette-ring data-outside-month:text-palette-accent/40 data-outside-month:hover:bg-transparent data-disabled:opacity-40 data-disabled:hover:bg-transparent data-unavailable:line-through data-unavailable:opacity-50 data-in-range:rounded-none data-in-range:bg-palette-soft data-range-preview:bg-palette-soft data-range-start:rounded-s-full data-range-end:rounded-e-full data-selected:bg-palette-ring data-selected:text-white data-in-range:data-selected:text-palette-contrast data-range-start:data-selected:text-white data-range-end:data-selected:text-white data-in-range:data-selected:bg-palette-soft data-range-start:data-selected:bg-palette-ring data-range-end:data-selected:bg-palette-ring`,
};

// spec/calendar.md, "Anatomy" (DatePicker and DateRangePicker)
export const datePicker: Recipe<"trigger" | "positioner" | "popup"> = {
    trigger: `${BUTTON} min-w-40 justify-start`,
    positioner: "z-50",
    popup: `${FLOATING_BOX} p-4`,
};
