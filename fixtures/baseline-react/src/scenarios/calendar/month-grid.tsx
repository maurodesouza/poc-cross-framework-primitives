import { CalendarCell, CalendarGrid } from "react-aria-components";

export function MonthGrid({ offset = 0 }: { offset?: number }) {
    return (
        <CalendarGrid weekdayStyle="short" offset={{ months: offset }}>
            {(date) => <CalendarCell date={date} />}
        </CalendarGrid>
    );
}
