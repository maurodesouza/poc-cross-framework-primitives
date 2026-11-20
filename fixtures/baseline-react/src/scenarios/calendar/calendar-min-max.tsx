import { parseDate } from "@internationalized/date";
import { SingleCalendar } from "./single-calendar.tsx";

export function CalendarMinMax() {
    return (
        <SingleCalendar
            minValue={parseDate("2026-11-10")}
            maxValue={parseDate("2026-12-05")}
        />
    );
}
