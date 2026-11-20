import { useState } from "react";
import {
    Button,
    Calendar,
    DatePicker,
    type DateValue,
    Dialog,
    Group,
    Popover,
} from "react-aria-components";
import { Output } from "../../kit/output.tsx";
import { MonthGrid } from "../calendar/month-grid.tsx";
import { MonthHeader } from "../calendar/month-header.tsx";

export function DatePickerBasic() {
    const [value, setValue] = useState<DateValue | null>(null);
    const [open, setOpen] = useState(false);
    return (
        <>
            <DatePicker
                aria-label="Date"
                value={value}
                onChange={setValue}
                isOpen={open}
                onOpenChange={setOpen}
            >
                <Group>
                    {/* React Aria labels its button "Calendar" unless given a label: the same visible text */}
                    <Button
                        aria-label={`Choose date: ${value?.toString() ?? "none"}`}
                    >
                        Choose date: {value?.toString() ?? "none"}
                    </Button>
                </Group>
                <Popover className="popup">
                    <Dialog>
                        <Calendar className="calendar">
                            <MonthHeader />
                            <MonthGrid />
                        </Calendar>
                    </Dialog>
                </Popover>
            </DatePicker>
            <Output values={{ value: value?.toString(), open }} />
        </>
    );
}
