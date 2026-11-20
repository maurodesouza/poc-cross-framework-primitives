import { useState } from "react";
import {
    Button,
    CalendarCell,
    CalendarGrid,
    DateRangePicker,
    type DateValue,
    Dialog,
    Group,
    Popover,
    RangeCalendar,
} from "react-aria-components";
import { Output } from "../../kit/output.tsx";
import { MonthHeader } from "../calendar/month-header.tsx";

export function DatePickerRange() {
    const [value, setValue] = useState<{
        start: DateValue;
        end: DateValue;
    } | null>(null);
    const text = value ? `${value.start}..${value.end}` : undefined;
    return (
        <>
            <DateRangePicker
                aria-label="Dates"
                value={value}
                onChange={setValue}
            >
                <Group>
                    <Button aria-label={`Choose dates: ${text ?? "none"}`}>
                        Choose dates: {text ?? "none"}
                    </Button>
                </Group>
                <Popover className="popup">
                    <Dialog>
                        <RangeCalendar className="calendar">
                            <MonthHeader />
                            <CalendarGrid weekdayStyle="short">
                                {(date) => <CalendarCell date={date} />}
                            </CalendarGrid>
                        </RangeCalendar>
                    </Dialog>
                </Popover>
            </DateRangePicker>
            <Output values={{ value: text }} />
        </>
    );
}
