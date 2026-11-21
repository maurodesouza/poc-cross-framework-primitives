import { Calendar, MonthView } from "../../kit/ui/calendar.tsx";

export function CalendarTwoMonths(props: { locale: string }) {
    return (
        <Calendar.Root locale={props.locale} visibleMonths={2}>
            <div class="flex gap-6">
                <MonthView />
                <MonthView offset={1} withButtons={false} />
            </div>
        </Calendar.Root>
    );
}
