import {
    Directive,
    forwardRef,
    inject,
    input,
    type ModelSignal,
    model,
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
    readonly value = model<PlainDate | null | undefined>(undefined);
    readonly defaultValue = input<PlainDate | null | undefined>(undefined);
    readonly valueChangeDetails = output<ValueChangeEvent<PlainDate | null>>();
    readonly picker = createDatePicker(
        "single",
        {
            open: this.open,
            defaultOpen: this.defaultOpen,
            value: this.value as unknown as ModelSignal<
                CalendarValue | undefined
            >,
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
