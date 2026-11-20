import type { CalendarDate } from "@internationalized/date";
import { useState } from "react";
import { Calendar, type DateValue } from "react-aria-components";
import { Output } from "../../kit/output.tsx";
import { MonthGrid } from "./month-grid.tsx";
import { MonthHeader } from "./month-header.tsx";

/** A single-date calendar with the scenario's options. */
export function SingleCalendar({
    minValue,
    maxValue,
    isDateUnavailable,
}: {
    minValue?: CalendarDate;
    maxValue?: CalendarDate;
    isDateUnavailable?: (date: DateValue) => boolean;
}) {
    const [value, setValue] = useState<DateValue | null>(null);
    return (
        <>
            <Calendar<DateValue>
                className="calendar"
                value={value}
                onChange={setValue}
                minValue={minValue}
                maxValue={maxValue}
                isDateUnavailable={isDateUnavailable}
            >
                <MonthHeader />
                <MonthGrid />
            </Calendar>
            <Output values={{ value: value?.toString() }} />
        </>
    );
}
