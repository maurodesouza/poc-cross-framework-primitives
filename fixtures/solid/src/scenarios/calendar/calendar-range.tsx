import type { DateRange } from "@poc/solid";
import { createSignal } from "solid-js";
import { isoRange } from "../../kit/iso.ts";
import { Output } from "../../kit/output.tsx";
import { MonthView, RangeCalendar } from "../../kit/ui/calendar.tsx";

export function CalendarRange(props: { locale: string }) {
    const [value, setValue] = createSignal<DateRange | null>(null);
    return (
        <>
            <RangeCalendar.Root
                value={value()}
                onValueChange={(next) => setValue(next)}
                locale={props.locale}
            >
                <MonthView />
            </RangeCalendar.Root>
            <Output values={{ value: isoRange(value()) }} />
        </>
    );
}
