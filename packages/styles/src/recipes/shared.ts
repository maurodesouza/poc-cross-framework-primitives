// Pieces several recipes share. Logical properties only (RTL-safe), no !important.

/** A focus ring on keyboard focus. */
export const FOCUS_RING =
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-ring";

/** A neutral button (triggers, close, calendar navigation). */
export const BUTTON = `inline-flex items-center justify-center gap-2 h-9 px-3 rounded-md border border-palette-line bg-palette-base text-palette-contrast text-sm font-medium hover:bg-palette-soft data-disabled:opacity-50 disabled:opacity-50 ${FOCUS_RING}`;

/** A floating box (popover, menu, combobox list, date picker). */
export const FLOATING_BOX =
    "palette-raised bg-palette-base text-palette-contrast border border-palette-line rounded-lg shadow-lg origin-(--transform-origin) transition-[opacity,scale] duration-150 data-starting-style:opacity-0 data-starting-style:scale-95 data-ending-style:opacity-0 data-ending-style:scale-95";

/** A row of a list (menu item, combobox item). */
export const LIST_ITEM =
    "flex items-center gap-2 h-8 px-2 rounded-md text-sm cursor-default select-none outline-none data-highlighted:bg-palette-soft data-disabled:opacity-50";
