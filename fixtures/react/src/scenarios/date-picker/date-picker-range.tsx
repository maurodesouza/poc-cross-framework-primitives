import { type DateRange, DateRangePicker as Primitive } from "@poc/react";
import { useState } from "react";
import { isoRange } from "../../kit/iso.ts";
import { Output } from "../../kit/output.tsx";
import { MonthView, RangeCalendar } from "../../kit/ui/calendar.tsx";
import { DatePicker } from "../../kit/ui/date-picker.tsx";

export function DatePickerRange({ locale }: { locale: string }) {
    const [value, setValue] = useState<DateRange | null>(null);
    return (
        <>
            <Primitive.Root
                value={value}
                onValueChange={setValue}
                locale={locale}
            >
                <DatePicker.Trigger>
                    Choose dates: {isoRange(value) ?? "none"}
                </DatePicker.Trigger>
                <DatePicker.Portal>
                    <DatePicker.Positioner sideOffset={4}>
                        <DatePicker.Popup>
                            <RangeCalendar.Root>
                                <MonthView />
                            </RangeCalendar.Root>
                        </DatePicker.Popup>
                    </DatePicker.Positioner>
                </DatePicker.Portal>
            </Primitive.Root>
            <Output values={{ value: isoRange(value) }} />
        </>
    );
}
