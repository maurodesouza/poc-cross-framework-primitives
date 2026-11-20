import type { Align, DateRange, PlainDate, Side } from "@poc/dom";
import { type ReactNode, useCallback, useMemo, useState } from "react";
import { useControllableState } from "../../hooks/use-controllable-state.ts";
import {
    type OverlayRootProps,
    useOverlayRoot,
} from "../../hooks/use-overlay-root.ts";
import type { ChangeDetails } from "../../utils/change-details.ts";
import type {
    CalendarMode,
    CalendarOptions,
    CalendarValue,
} from "../calendar/calendar-value.ts";
import { DatePickerContext } from "./date-picker-context.ts";

interface PickerProps extends OverlayRootProps, CalendarOptions {
    children?: ReactNode;
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

function PickerRoot({
    mode,
    value: valueProp,
    defaultValue,
    onValueChange,
    min,
    max,
    isDateUnavailable,
    locale,
    firstDayOfWeek,
    visibleMonths,
    children,
    ...overlayProps
}: PickerProps & {
    mode: CalendarMode;
    value?: CalendarValue;
    defaultValue?: CalendarValue;
    onValueChange?: (value: CalendarValue, details: ChangeDetails) => void;
}) {
    const root = useOverlayRoot(overlayProps);
    const [value, setValue] = useControllableState<
        CalendarValue,
        ChangeDetails
    >(valueProp, defaultValue ?? null, onValueChange);
    const [placed, setPlaced] = useState<{ side: Side; align: Align }>({
        side: "bottom",
        align: "start",
    });
    const { setOpen } = root;
    const choose = useCallback(
        (next: CalendarValue) => {
            setValue(next, { reason: "item-press" });
            setOpen(false, "item-press");
        },
        [setValue, setOpen],
    );
    const options = useMemo(
        () => ({
            min,
            max,
            isDateUnavailable,
            locale,
            firstDayOfWeek,
            visibleMonths,
        }),
        [min, max, isDateUnavailable, locale, firstDayOfWeek, visibleMonths],
    );
    const context = useMemo(
        () => ({ ...root, mode, value, choose, options, placed, setPlaced }),
        [root, mode, value, choose, options, placed],
    );
    return (
        <DatePickerContext.Provider value={context}>
            {children}
        </DatePickerContext.Provider>
    );
}

/** A trigger and a popover holding a bound `Calendar.Root` (spec/calendar.md). */
export function DatePickerRoot(props: DatePickerRootProps) {
    return <PickerRoot mode="single" {...(props as PickerProps)} />;
}

/** A trigger and a popover holding a bound `RangeCalendar.Root` (spec/calendar.md). */
export function DateRangePickerRoot(props: DateRangePickerRootProps) {
    return <PickerRoot mode="range" {...(props as PickerProps)} />;
}
