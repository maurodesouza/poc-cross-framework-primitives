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
import { CalendarRootBase } from "./calendar-root-base.ts";
import { CALENDAR, CalendarState } from "./calendar-state.ts";
import type { CalendarValue } from "./calendar-value.ts";

/**
 * A range of dates (spec/calendar.md): `<div rangeCalendarRoot [(value)]="range">`. Inside a DateRangePicker
 * with no value of its own, it binds to it.
 */
@Directive({
    selector: "[rangeCalendarRoot]",
    exportAs: "rangeCalendarRoot",
    providers: [
        {
            provide: CALENDAR,
            useFactory: () =>
                inject(forwardRef(() => RangeCalendarRoot)).calendar,
        },
    ],
})
export class RangeCalendarRoot extends CalendarRootBase {
    readonly value = input<DateRange | null | undefined>(undefined);
    readonly valueChange = output<DateRange | null>();
    readonly defaultValue = input<DateRange | null | undefined>(undefined);
    readonly valueChangeDetails = output<ValueChangeEvent<DateRange | null>>();
    readonly calendar = new CalendarState(
        "range",
        this.stateInputs(
            this.value,
            this.valueChange as unknown as OutputEmitterRef<CalendarValue>,
            this.defaultValue,
        ),
        (value, details) =>
            this.valueChangeDetails.emit({
                value: value as DateRange | null,
                details,
            }),
    );
}
