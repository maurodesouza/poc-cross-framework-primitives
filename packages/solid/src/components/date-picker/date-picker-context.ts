import { createContext } from "solid-js";
import type { OverlayRoot } from "../../hooks/create-overlay-root.ts";
import type { Placement } from "../../hooks/create-positioner.ts";
import type {
    CalendarMode,
    CalendarOptions,
    CalendarValue,
} from "../calendar/calendar-value.ts";

export interface DatePickerContextValue extends OverlayRoot {
    mode: CalendarMode;
    value: () => CalendarValue;
    /** Sets the value and closes the popup (reason `item-press`). */
    choose: (value: CalendarValue) => void;
    /** The calendar options given to the picker (reactive getters). */
    options: CalendarOptions;
    placed: () => Placement;
    setPlaced: (placed: Placement) => void;
}

/** `null` outside a picker: a calendar there holds its own value. */
export const DatePickerContext = createContext<DatePickerContextValue | null>(
    null,
);
