import { SingleCalendar } from "./single-calendar.tsx";

const isWeekend = (date: { year: number; month: number; day: number }) => {
    const day = new Date(date.year, date.month - 1, date.day).getDay();
    return day === 0 || day === 6;
};

export function CalendarUnavailable(props: { locale: string }) {
    return (
        <SingleCalendar locale={props.locale} isDateUnavailable={isWeekend} />
    );
}
