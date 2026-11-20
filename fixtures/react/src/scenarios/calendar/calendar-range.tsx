import type { DateRange } from "@poc/react";
import { useState } from "react";
import { isoRange } from "../../kit/iso.ts";
import { Output } from "../../kit/output.tsx";
import { MonthView, RangeCalendar } from "../../kit/ui/calendar.tsx";

export function CalendarRange({ locale }: { locale: string }) {
    const [value, setValue] = useState<DateRange | null>(null);
    return (
        <>
            <RangeCalendar.Root
                value={value}
                onValueChange={setValue}
                locale={locale}
            >
                <MonthView />
            </RangeCalendar.Root>
            <Output values={{ value: isoRange(value) }} />
        </>
    );
}
