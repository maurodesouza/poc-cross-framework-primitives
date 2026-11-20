import { DatePickerPopup } from "./date-picker-popup.ts";
import { DatePickerPortal } from "./date-picker-portal.ts";
import { DatePickerPositioner } from "./date-picker-positioner.ts";
import { DatePickerRoot, DateRangePickerRoot } from "./date-picker-root.ts";
import { DatePickerTrigger } from "./date-picker-trigger.ts";

const parts = {
    Trigger: DatePickerTrigger,
    Portal: DatePickerPortal,
    Positioner: DatePickerPositioner,
    Popup: DatePickerPopup,
};

/** spec/calendar.md: a trigger and a popover holding a bound Calendar */
export const DatePicker = { Root: DatePickerRoot, ...parts };

/** spec/calendar.md: a trigger and a popover holding a bound RangeCalendar */
export const DateRangePicker = { Root: DateRangePickerRoot, ...parts };
