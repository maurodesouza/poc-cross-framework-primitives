import {
    type ChangeDetails,
    type PlainDate,
    DatePicker as Primitive,
} from "@poc/solid";
import { createSignal } from "solid-js";
import { iso } from "../../kit/iso.ts";
import { Output } from "../../kit/output.tsx";
import { Calendar, MonthView } from "../../kit/ui/calendar.tsx";
import { DatePicker } from "../../kit/ui/date-picker.tsx";

export function DatePickerBasic(props: { locale: string }) {
    const [value, setValue] = createSignal<PlainDate | null>(null);
    const [open, setOpen] = createSignal(false);
    const [reason, setReason] = createSignal<string>();
    return (
        <>
            <Primitive.Root
                value={value()}
                onValueChange={(next) => setValue(next)}
                open={open()}
                onOpenChange={(next: boolean, details: ChangeDetails) => {
                    setOpen(next);
                    setReason(details.reason);
                }}
                locale={props.locale}
            >
                <DatePicker.Trigger>
                    Choose date: {iso(value()) ?? "none"}
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
            <Output
                values={{ value: iso(value()), open: open(), reason: reason() }}
            />
        </>
    );
}
