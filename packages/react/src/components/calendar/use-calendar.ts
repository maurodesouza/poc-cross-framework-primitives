import {
    addMonths,
    clampDate,
    compareDates,
    type DateRange,
    endOfMonth,
    firstDayOfWeek,
    isBetween,
    isSameDate,
    isSameMonth,
    isWithinBounds,
    monthsBetween,
    type PlainDate,
    startOfMonth,
    today,
    toIsoDate,
} from "@poc/dom";
import { useCallback, useContext, useId, useMemo, useState } from "react";
import { useControllableState } from "../../hooks/use-controllable-state.ts";
import type { ChangeDetails } from "../../utils/change-details.ts";
import { DatePickerContext } from "../date-picker/date-picker-context.ts";
import type { CalendarContextValue, CellState } from "./calendar-context.ts";
import {
    type CalendarMode,
    type CalendarOptions,
    type CalendarValue,
    isRange,
} from "./calendar-value.ts";

export interface CalendarStateProps extends CalendarOptions {
    value?: CalendarValue;
    defaultValue?: CalendarValue;
    onValueChange?: (value: CalendarValue, details: ChangeDetails) => void;
    disabled?: boolean;
    readOnly?: boolean;
}

function documentLocale(): string {
    if (typeof document !== "undefined" && document.documentElement.lang) {
        return document.documentElement.lang;
    }
    return typeof navigator !== "undefined" ? navigator.language : "en-US";
}

/**
 * The state of a Calendar or RangeCalendar (spec/calendar.md): the focused date and the visible
 * months, the value (its own, or a picker's when it sits in one with no value of its own), and
 * the range being chosen.
 */
export function useCalendar(mode: CalendarMode, props: CalendarStateProps) {
    const picker = useContext(DatePickerContext);
    const bound =
        picker !== null &&
        props.value === undefined &&
        props.defaultValue === undefined;
    const options: CalendarOptions = bound
        ? { ...picker.options, ...stripUndefined(props) }
        : props;
    const [ownValue, setOwnValue] = useControllableState<
        CalendarValue,
        ChangeDetails
    >(props.value, props.defaultValue ?? null, props.onValueChange);
    const value = bound ? picker.value : ownValue;
    const min = options.min ?? null;
    const max = options.max ?? null;
    const locale = options.locale ?? documentLocale();
    const firstDay = options.firstDayOfWeek ?? firstDayOfWeek(locale);
    const visibleMonths = Math.max(1, options.visibleMonths ?? 1);
    const disabled = props.disabled ?? false;
    const readOnly = props.readOnly ?? false;
    const [todayDate] = useState(() => today());
    const initialFocus = clampDate(
        (isRange(value) ? value.start : value) ?? todayDate,
        min,
        max,
    );
    const [focusedDate, setFocusedDate] = useState(initialFocus);
    const [visibleStart, setVisibleStart] = useState(() =>
        startOfMonth(initialFocus),
    );
    const [anchor, setAnchor] = useState<PlainDate | null>(null);
    const [hovered, setHovered] = useState<PlainDate | null>(null);
    const cells = useMemo(() => new Map<string, HTMLElement>(), []);
    const baseId = useId();

    const isOutOfBounds = useCallback(
        (date: PlainDate) => disabled || !isWithinBounds(date, min, max),
        [disabled, min, max],
    );
    const isUnavailable = options.isDateUnavailable;

    const moveFocus = useCallback(
        (date: PlainDate) => {
            if (isOutOfBounds(date)) {
                return false;
            }
            setFocusedDate(date);
            setVisibleStart((start) => {
                const offset = monthsBetween(start, date);
                if (offset < 0) {
                    return startOfMonth(date);
                }
                if (offset >= visibleMonths) {
                    return addMonths(startOfMonth(date), -(visibleMonths - 1));
                }
                return start;
            });
            return true;
        },
        [isOutOfBounds, visibleMonths],
    );

    const canPage = useCallback(
        (delta: 1 | -1) => {
            const start = addMonths(visibleStart, delta * visibleMonths);
            const end = endOfMonth(addMonths(start, visibleMonths - 1));
            return (
                (max === null || compareDates(start, max) <= 0) &&
                (min === null || compareDates(end, min) >= 0)
            );
        },
        [visibleStart, visibleMonths, min, max],
    );
    const page = useCallback(
        (delta: 1 | -1) => {
            if (!canPage(delta)) {
                return;
            }
            setVisibleStart((start) => addMonths(start, delta * visibleMonths));
            setFocusedDate((date) =>
                clampDate(addMonths(date, delta * visibleMonths), min, max),
            );
        },
        [canPage, visibleMonths, min, max],
    );

    const commit = useCallback(
        (next: CalendarValue) => {
            if (bound) {
                picker.choose(next);
            } else {
                setOwnValue(next, { reason: "item-press" });
            }
        },
        [bound, picker, setOwnValue],
    );

    const select = useCallback(
        (date: PlainDate) => {
            if (isOutOfBounds(date) || isUnavailable?.(date) || readOnly) {
                return;
            }
            setFocusedDate(date);
            if (mode === "single") {
                commit(date);
                return;
            }
            if (anchor === null) {
                setAnchor(date);
                return;
            }
            const [start, end] =
                compareDates(anchor, date) <= 0
                    ? [anchor, date]
                    : [date, anchor];
            setAnchor(null);
            setHovered(null);
            commit({ start, end });
        },
        [isOutOfBounds, isUnavailable, readOnly, mode, anchor, commit],
    );

    const rangeValue: DateRange | null = isRange(value) ? value : null;
    const previewTo = hovered ?? focusedDate;
    const cellState = useCallback(
        (date: PlainDate, month: PlainDate): CellState => {
            const outsideMonth = !isSameMonth(date, month);
            const inRange =
                rangeValue !== null &&
                isBetween(date, rangeValue.start, rangeValue.end);
            const selected =
                mode === "single"
                    ? !isRange(value) && isSameDate(value, date)
                    : inRange;
            return {
                today: isSameDate(date, todayDate),
                selected,
                disabled: isOutOfBounds(date),
                unavailable: isUnavailable?.(date) ?? false,
                outsideMonth,
                focused: !outsideMonth && isSameDate(date, focusedDate),
                rangeStart:
                    rangeValue !== null && isSameDate(date, rangeValue.start),
                rangeEnd:
                    rangeValue !== null && isSameDate(date, rangeValue.end),
                inRange,
                rangePreview:
                    anchor !== null && isBetween(date, anchor, previewTo),
            };
        },
        [
            rangeValue,
            mode,
            value,
            todayDate,
            isOutOfBounds,
            isUnavailable,
            focusedDate,
            anchor,
            previewTo,
        ],
    );

    const context: Omit<CalendarContextValue, "requestFocus" | "focusPending"> =
        {
            mode,
            locale,
            firstDay,
            visibleMonths,
            visibleStart,
            focusedDate,
            disabled,
            readOnly,
            baseId,
            headingId: (offset) => `${baseId}-heading-${offset}`,
            gridId: (offset) => `${baseId}-grid-${offset}`,
            cellState,
            moveFocus,
            page,
            canPage,
            select,
            anchor,
            cancelRange: () => {
                setAnchor(null);
                setHovered(null);
            },
            setHovered,
            cells,
            rangeValue,
        };
    return { context, bound, focusKey: toIsoDate(focusedDate) };
}

function stripUndefined(props: CalendarOptions): CalendarOptions {
    return Object.fromEntries(
        Object.entries({
            min: props.min,
            max: props.max,
            isDateUnavailable: props.isDateUnavailable,
            locale: props.locale,
            firstDayOfWeek: props.firstDayOfWeek,
            visibleMonths: props.visibleMonths,
        }).filter(([, value]) => value !== undefined),
    );
}
