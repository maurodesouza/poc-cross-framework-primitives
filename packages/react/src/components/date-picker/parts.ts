import { DatePickerPopup } from "./date-picker-popup.tsx";
import { DatePickerPortal } from "./date-picker-portal.tsx";
import { DatePickerPositioner } from "./date-picker-positioner.tsx";
import { DatePickerRoot, DateRangePickerRoot } from "./date-picker-root.tsx";
import { DatePickerTrigger } from "./date-picker-trigger.tsx";

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
