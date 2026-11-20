import { useState } from "react";
import {
    CalendarCell,
    CalendarGrid,
    type DateValue,
    RangeCalendar,
} from "react-aria-components";
import { Output } from "../../kit/output.tsx";
import { MonthHeader } from "./month-header.tsx";

export function CalendarRange() {
    const [value, setValue] = useState<{
        start: DateValue;
        end: DateValue;
    } | null>(null);
    return (
        <>
            <RangeCalendar
                className="calendar"
                value={value}
                onChange={setValue}
            >
                <MonthHeader />
                <CalendarGrid weekdayStyle="short">
                    {(date) => <CalendarCell date={date} />}
                </CalendarGrid>
            </RangeCalendar>
            <Output
                values={{
                    value: value ? `${value.start}..${value.end}` : undefined,
                }}
            />
        </>
    );
}
