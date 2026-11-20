import { Calendar } from "react-aria-components";
import { MonthGrid } from "./month-grid.tsx";
import { MonthHeader } from "./month-header.tsx";

export function CalendarTwoMonths() {
    return (
        <Calendar className="calendar" visibleDuration={{ months: 2 }}>
            <MonthHeader />
            <div className="calendar-pair">
                <MonthGrid />
                <MonthGrid offset={1} />
            </div>
        </Calendar>
    );
}
