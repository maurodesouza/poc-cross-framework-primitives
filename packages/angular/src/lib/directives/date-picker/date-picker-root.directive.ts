import {
    Directive,
    forwardRef,
    inject,
    input,
    type OutputEmitterRef,
    output,
} from "@angular/core";
import type { PlainDate } from "@poc/dom";
import type { ValueChangeEvent } from "../../utils/change-details.ts";
import type { CalendarValue } from "../calendar/calendar-value.ts";
import { DatePickerRootBase } from "./date-picker-root-base.ts";
import { createDatePicker, DATE_PICKER } from "./date-picker-state.ts";

/**
 * A trigger and a popover holding a bound `[calendarRoot]` (spec/calendar.md):
 * `<ng-container datePickerRoot [(value)]="date">`.
 */
@Directive({
    selector: "[datePickerRoot]",
    exportAs: "datePickerRoot",
    providers: [
        {
            provide: DATE_PICKER,
            useFactory: () => inject(forwardRef(() => DatePickerRoot)).picker,
        },
    ],
})
export class DatePickerRoot extends DatePickerRootBase {
    readonly value = input<PlainDate | null | undefined>(undefined);
    readonly valueChange = output<PlainDate | null>();
    readonly defaultValue = input<PlainDate | null | undefined>(undefined);
    readonly valueChangeDetails = output<ValueChangeEvent<PlainDate | null>>();
    readonly picker = createDatePicker(
        "single",
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
                value: value as PlainDate | null,
                details,
            }),
    );
}
