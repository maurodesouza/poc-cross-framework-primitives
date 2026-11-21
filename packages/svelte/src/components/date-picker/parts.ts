import DatePickerPopup from "./date-picker-popup.svelte";
import DatePickerPortal from "./date-picker-portal.svelte";
import DatePickerPositioner from "./date-picker-positioner.svelte";
import DatePickerRoot from "./date-picker-root.svelte";
import DatePickerTrigger from "./date-picker-trigger.svelte";
import DateRangePickerRoot from "./date-range-picker-root.svelte";

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
