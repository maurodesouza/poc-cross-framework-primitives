import {
    type ChangeDetails,
    type PlainDate,
    DatePicker as Primitive,
} from "@poc/react";
import { useState } from "react";
import { iso } from "../../kit/iso.ts";
import { Output } from "../../kit/output.tsx";
import { Calendar, MonthView } from "../../kit/ui/calendar.tsx";
import { DatePicker } from "../../kit/ui/date-picker.tsx";

export function DatePickerBasic({ locale }: { locale: string }) {
    const [value, setValue] = useState<PlainDate | null>(null);
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState<string>();
    return (
        <>
            <Primitive.Root
                value={value}
                onValueChange={setValue}
                open={open}
                onOpenChange={(next: boolean, details: ChangeDetails) => {
                    setOpen(next);
                    setReason(details.reason);
                }}
                locale={locale}
            >
                <DatePicker.Trigger>
                    Choose date: {iso(value) ?? "none"}
                </DatePicker.Trigger>
                <DatePicker.Portal>
                    <DatePicker.Positioner sideOffset={4}>
                        <DatePicker.Popup>
                            <Calendar.Root>
                                <MonthView />
                            </Calendar.Root>
                        </DatePicker.Popup>
                    </DatePicker.Positioner>
                </DatePicker.Portal>
            </Primitive.Root>
            <Output values={{ value: iso(value), open, reason }} />
        </>
    );
}
