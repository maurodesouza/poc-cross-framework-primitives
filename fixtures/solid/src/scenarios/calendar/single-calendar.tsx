import type { PlainDate } from "@poc/solid";
import { createSignal } from "solid-js";
import { iso } from "../../kit/iso.ts";
import { Output } from "../../kit/output.tsx";
import { Calendar, MonthView } from "../../kit/ui/calendar.tsx";

/** A single-date calendar with the scenario's options. */
export function SingleCalendar(props: {
    locale: string;
    min?: PlainDate;
    max?: PlainDate;
    isDateUnavailable?: (date: PlainDate) => boolean;
}) {
    const [value, setValue] = createSignal<PlainDate | null>(null);
    return (
        <>
            <Calendar.Root
                value={value()}
                onValueChange={(next) => setValue(next)}
                locale={props.locale}
                min={props.min}
                max={props.max}
                isDateUnavailable={props.isDateUnavailable}
            >
                <MonthView />
            </Calendar.Root>
            <Output values={{ value: iso(value()) }} />
        </>
    );
}
