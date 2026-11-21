import {
    Directive,
    forwardRef,
    inject,
    input,
    type OutputEmitterRef,
    output,
} from "@angular/core";
import type { DateRange } from "@poc/dom";
import type { ValueChangeEvent } from "../../utils/change-details.ts";
import type { CalendarValue } from "../calendar/calendar-value.ts";
import { DatePickerRootBase } from "./date-picker-root-base.ts";
import { createDatePicker, DATE_PICKER } from "./date-picker-state.ts";

/**
 * A trigger and a popover holding a bound `[rangeCalendarRoot]` (spec/calendar.md):
 * `<ng-container dateRangePickerRoot [(value)]="range">`.
 */
@Directive({
    selector: "[dateRangePickerRoot]",
    exportAs: "dateRangePickerRoot",
    providers: [
        {
            provide: DATE_PICKER,
            useFactory: () =>
                inject(forwardRef(() => DateRangePickerRoot)).picker,
        },
    ],
})
export class DateRangePickerRoot extends DatePickerRootBase {
    readonly value = input<DateRange | null | undefined>(undefined);
    readonly valueChange = output<DateRange | null>();
    readonly defaultValue = input<DateRange | null | undefined>(undefined);
    readonly valueChangeDetails = output<ValueChangeEvent<DateRange | null>>();
    readonly picker = createDatePicker(
        "range",
        {
            open: this.open,
            openChange: this.openChange,
            defaultOpen: this.defaultOpen,
            value: this.value,
            valueChange: this
                .valueChange as unknown as OutputEmitterRef<CalendarValue>,
            defaultValue: this.defaultValue,
            options: this.options,
        },
        (event) => this.openChangeDetails.emit(event),
        (value, details) =>
            this.valueChangeDetails.emit({
                value: value as DateRange | null,
                details,
            }),
    );
}
