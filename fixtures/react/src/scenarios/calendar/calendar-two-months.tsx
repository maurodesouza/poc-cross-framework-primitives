import { Calendar, MonthView } from "../../kit/ui/calendar.tsx";

export function CalendarTwoMonths({ locale }: { locale: string }) {
    return (
        <Calendar.Root locale={locale} visibleMonths={2}>
            <div className="flex gap-6">
                <MonthView />
                <MonthView offset={1} withButtons={false} />
            </div>
        </Calendar.Root>
    );
}
