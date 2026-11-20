import { isWeekend } from "@internationalized/date";
import { SingleCalendar } from "./single-calendar.tsx";

export function CalendarUnavailable({ locale }: { locale: string }) {
    return (
        <SingleCalendar isDateUnavailable={(date) => isWeekend(date, locale)} />
    );
}
