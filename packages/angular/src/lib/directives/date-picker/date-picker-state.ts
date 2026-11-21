import {
    computed,
    InjectionToken,
    type InputSignal,
    type ModelSignal,
    type Signal,
} from "@angular/core";
import type {
    ChangeDetails,
    OpenChangeEvent,
} from "../../utils/change-details.ts";
import { controllable } from "../../utils/controllable.ts";
import { createOverlayRoot } from "../../utils/overlay-root.ts";
import { placementSignal } from "../../utils/positioner.ts";
import type {
    CalendarMode,
    CalendarOptions,
    CalendarValue,
} from "../calendar/calendar-value.ts";

/** The inputs a DatePicker or DateRangePicker root hands its state. */
export interface DatePickerInputs {
    open: ModelSignal<boolean | undefined>;
    defaultOpen: InputSignal<boolean>;
    value: ModelSignal<CalendarValue | undefined>;
    defaultValue: Signal<CalendarValue | undefined>;
    options: Signal<CalendarOptions>;
}

/** The enclosing picker's state, for its parts and the calendar it holds. */
export const DATE_PICKER = new InjectionToken<DatePickerState>("DATE_PICKER");

/**
 * A trigger and a popover holding a bound calendar (spec/calendar.md, pickers): the overlay, the
 * value, and the options the calendar inherits. Created in a root directive's injection context.
 */
export function createDatePicker(
    mode: CalendarMode,
    inputs: DatePickerInputs,
    emitOpen: (event: OpenChangeEvent) => void,
    emitValue: (value: CalendarValue, details: ChangeDetails) => void,
) {
    const overlay = createOverlayRoot(inputs, emitOpen, "poc-date-picker");
    const state = controllable<CalendarValue, ChangeDetails>(
        inputs.value,
        () => inputs.defaultValue() ?? null,
        emitValue,
    );
    return {
        mode,
        overlay,
        value: state.value,
        options: inputs.options,
        placed: placementSignal({ side: "bottom", align: "start" }),
        state: computed(() => ({ open: overlay.open() })),
        /** Sets the value and closes the popup (reason `item-press`). */
        choose: (next: CalendarValue) => {
            state.set(next, { reason: "item-press" });
            overlay.setOpen(false, "item-press");
        },
    };
}

export type DatePickerState = ReturnType<typeof createDatePicker>;
