import { computed, inject, type Signal } from "@angular/core";
import type { CalendarValue } from "../directives/calendar/calendar-value.ts";
import { DATE_PICKER } from "../directives/date-picker/date-picker-state.ts";
import type { ChangeReason } from "../utils/change-details.ts";

/** The part hook of the enclosing `[datePickerRoot]` or `[dateRangePickerRoot]`: its state and `setOpen`. */
export function injectDatePicker(): {
    state: Signal<{ open: boolean; value: CalendarValue }>;
    setOpen: (open: boolean, reason?: ChangeReason) => void;
} {
    const picker = inject(DATE_PICKER, { optional: true });
    if (picker === null) {
        throw new Error(
            "injectDatePicker() must be used inside [datePickerRoot] or [dateRangePickerRoot]",
        );
    }
    return {
        state: computed(() => ({
            open: picker.overlay.open(),
            value: picker.value(),
        })),
        setOpen: (open, reason = "none") =>
            picker.overlay.setOpen(open, reason),
    };
}
