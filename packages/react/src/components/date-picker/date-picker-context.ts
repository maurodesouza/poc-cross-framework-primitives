import type { Align, Side } from "@poc/dom";
import { createContext } from "react";
import type { OverlayRoot } from "../../hooks/use-overlay-root.ts";
import type {
    CalendarMode,
    CalendarOptions,
    CalendarValue,
} from "../calendar/calendar-value.ts";

export interface DatePickerContextValue extends OverlayRoot {
    mode: CalendarMode;
    value: CalendarValue;
    /** Sets the value and closes the popup (reason `item-press`). */
    choose: (value: CalendarValue) => void;
    options: CalendarOptions;
    placed: { side: Side; align: Align };
    setPlaced: (placed: { side: Side; align: Align }) => void;
}

export const DatePickerContext = createContext<DatePickerContextValue | null>(
    null,
);
