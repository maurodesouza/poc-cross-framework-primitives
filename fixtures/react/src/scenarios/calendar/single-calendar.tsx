import type { PlainDate } from "@poc/react";
import { useState } from "react";
import { iso } from "../../kit/iso.ts";
import { Output } from "../../kit/output.tsx";
import { Calendar, MonthView } from "../../kit/ui/calendar.tsx";

/** A single-date calendar with the scenario's options. */
export function SingleCalendar({
    locale,
    min,
    max,
    isDateUnavailable,
}: {
    locale: string;
    min?: PlainDate;
    max?: PlainDate;
    isDateUnavailable?: (date: PlainDate) => boolean;
}) {
    const [value, setValue] = useState<PlainDate | null>(null);
    return (
        <>
            <Calendar.Root
                value={value}
                onValueChange={setValue}
                locale={locale}
                min={min}
                max={max}
                isDateUnavailable={isDateUnavailable}
            >
                <MonthView />
            </Calendar.Root>
            <Output values={{ value: iso(value) }} />
        </>
    );
}
