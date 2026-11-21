import type { DateRange, PlainDate } from "@poc/dom";
import type { JSX } from "@solidjs/web";
import { createControllable } from "../../hooks/create-controllable.ts";
import {
    createOverlayRoot,
    type OverlayRootProps,
} from "../../hooks/create-overlay-root.ts";
import { createPlacement } from "../../hooks/create-positioner.ts";
import type { ChangeDetails } from "../../utils/change-details.ts";
import type {
    CalendarMode,
    CalendarOptions,
    CalendarValue,
} from "../calendar/calendar-value.ts";
import {
    DatePickerContext,
    type DatePickerContextValue,
} from "./date-picker-context.ts";

interface PickerProps extends OverlayRootProps, CalendarOptions {
    children?: JSX.Element;
}

export interface DatePickerRootProps extends PickerProps {
    value?: PlainDate | null;
    defaultValue?: PlainDate | null;
    onValueChange?: (value: PlainDate | null, details: ChangeDetails) => void;
}

export interface DateRangePickerRootProps extends PickerProps {
    value?: DateRange | null;
    defaultValue?: DateRange | null;
    onValueChange?: (value: DateRange | null, details: ChangeDetails) => void;
}

type AnyPickerProps = PickerProps & {
    value?: CalendarValue;
    defaultValue?: CalendarValue;
    onValueChange?: (value: CalendarValue, details: ChangeDetails) => void;
};

function renderPicker(mode: CalendarMode, props: AnyPickerProps): JSX.Element {
    const root = createOverlayRoot(props);
    const [value, setValue] = createControllable<CalendarValue, ChangeDetails>(
        () => props.value,
        () => props.defaultValue ?? null,
        (next, details) => props.onValueChange?.(next, details),
    );
    const [placed, setPlaced] = createPlacement(() => ({
        side: "bottom",
        align: "start",
    }));
    const context: DatePickerContextValue = {
        ...root,
        mode,
        value,
        choose: (next) => {
            setValue(next, { reason: "item-press" });
            root.setOpen(false, "item-press");
        },
        options: {
            get min() {
                return props.min;
            },
            get max() {
                return props.max;
            },
            get isDateUnavailable() {
                return props.isDateUnavailable;
            },
            get locale() {
                return props.locale;
            },
            get firstDayOfWeek() {
                return props.firstDayOfWeek;
            },
            get visibleMonths() {
                return props.visibleMonths;
            },
        },
        placed,
        setPlaced,
    };
    return (
        <DatePickerContext value={context}>{props.children}</DatePickerContext>
    );
}

/** A trigger and a popover holding a bound `Calendar.Root` (spec/calendar.md). */
export function DatePickerRoot(props: DatePickerRootProps) {
    return renderPicker("single", props as AnyPickerProps);
}

/** A trigger and a popover holding a bound `RangeCalendar.Root` (spec/calendar.md). */
export function DateRangePickerRoot(props: DateRangePickerRootProps) {
    return renderPicker("range", props as AnyPickerProps);
}
