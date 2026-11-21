import { SingleCalendar } from "./single-calendar.tsx";

export function CalendarMinMax(props: { locale: string }) {
    return (
        <SingleCalendar
            locale={props.locale}
            min={{ year: 2026, month: 11, day: 10 }}
            max={{ year: 2026, month: 12, day: 5 }}
        />
    );
}
