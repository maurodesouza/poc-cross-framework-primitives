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
import {
    createEffect,
    createSignal,
    createUniqueId,
    untrack,
    useContext,
} from "solid-js";
import { createControllable } from "../../hooks/create-controllable.ts";
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
 * months, the value (its own, or a picker's when it sits in one with no value of its own), the
 * range being chosen, and the pending focus of the focused date's cell.
 */
export function createCalendar(
    mode: CalendarMode,
    props: CalendarStateProps,
): CalendarContextValue {
    const picker = useContext(DatePickerContext);
    const bound = () =>
        picker !== null &&
        props.value === undefined &&
        props.defaultValue === undefined;
    // the calendar's own option, else (bound to a picker) the picker's
    const option = <K extends keyof CalendarOptions>(
        key: K,
    ): CalendarOptions[K] => {
        const own = props[key];
        return own === undefined && picker !== null && bound()
            ? picker.options[key]
            : own;
    };
    const [ownValue, setOwnValue] = createControllable<
        CalendarValue,
        ChangeDetails
    >(
        () => props.value,
        () => props.defaultValue ?? null,
        (next, details) => props.onValueChange?.(next, details),
    );
    const value = () =>
        picker !== null && bound() ? picker.value() : ownValue();
    const min = () => option("min") ?? null;
    const max = () => option("max") ?? null;
    const locale = () => option("locale") ?? documentLocale();
    const firstDay = () => option("firstDayOfWeek") ?? firstDayOfWeek(locale());
    const visibleMonths = () => Math.max(1, option("visibleMonths") ?? 1);
    const disabled = () => props.disabled ?? false;
    const readOnly = () => props.readOnly ?? false;
    const todayDate = today();
    // seeded once, like the first render's state: later value changes do not move the focus
    const initialFocus = untrack(() => {
        const current = value();
        return clampDate(
            (isRange(current) ? current.start : current) ?? todayDate,
            min(),
            max(),
        );
    });
    const [focusedDate, setFocusedDate] = createSignal(initialFocus);
    const [visibleStart, setVisibleStart] = createSignal(
        startOfMonth(initialFocus),
    );
    const [anchor, setAnchor] = createSignal<PlainDate | null>(null);
    const [hovered, setHovered] = createSignal<PlainDate | null>(null);
    const [focusRequests, setFocusRequests] = createSignal(0);
    const cells = new Map<string, HTMLElement>();
    const baseId = createUniqueId();
    // a calendar in a picker focuses its focused date when it opens (spec/calendar.md, "Focus")
    const focusPending = { current: untrack(bound) };

    // Solid runs effects parent first: the picker's popup returns focus to its trigger before a
    // calendar's effect would focus a cell, so a closing picker's calendar takes no focus
    // (React's layout effects ran before the popup's effect cleanup, in the other order)
    const canTakeFocus = () => picker === null || picker.open();

    const isOutOfBounds = (date: PlainDate) =>
        disabled() || !isWithinBounds(date, min(), max());

    const moveFocus = (date: PlainDate) => {
        if (isOutOfBounds(date)) {
            return false;
        }
        const months = visibleMonths();
        setFocusedDate(date);
        setVisibleStart((start) => {
            const offset = monthsBetween(start, date);
            if (offset < 0) {
                return startOfMonth(date);
            }
            if (offset >= months) {
                return addMonths(startOfMonth(date), -(months - 1));
            }
            return start;
        });
        return true;
    };

    const canPage = (delta: 1 | -1) => {
        const months = visibleMonths();
        const start = addMonths(visibleStart(), delta * months);
        const end = endOfMonth(addMonths(start, months - 1));
        const upper = max();
        const lower = min();
        return (
            (upper === null || compareDates(start, upper) <= 0) &&
            (lower === null || compareDates(end, lower) >= 0)
        );
    };
    const page = (delta: 1 | -1) => {
        if (!canPage(delta)) {
            return;
        }
        const months = visibleMonths();
        setVisibleStart((start) => addMonths(start, delta * months));
        setFocusedDate((date) =>
            clampDate(addMonths(date, delta * months), min(), max()),
        );
    };

    const commit = (next: CalendarValue) => {
        if (picker !== null && bound()) {
            picker.choose(next);
        } else {
            setOwnValue(next, { reason: "item-press" });
        }
    };

    const select = (date: PlainDate) => {
        if (
            isOutOfBounds(date) ||
            option("isDateUnavailable")?.(date) ||
            readOnly()
        ) {
            return;
        }
        setFocusedDate(date);
        if (mode === "single") {
            commit(date);
            return;
        }
        const start = anchor();
        if (start === null) {
            setAnchor(date);
            return;
        }
        const [from, to] =
            compareDates(start, date) <= 0 ? [start, date] : [date, start];
        setAnchor(null);
        setHovered(null);
        commit({ start: from, end: to });
    };

    const cellState = (date: PlainDate, month: PlainDate): CellState => {
        const current = value();
        const rangeValue: DateRange | null = isRange(current) ? current : null;
        const outsideMonth = !isSameMonth(date, month);
        const inRange =
            rangeValue !== null &&
            isBetween(date, rangeValue.start, rangeValue.end);
        const selected =
            mode === "single"
                ? !isRange(current) && isSameDate(current, date)
                : inRange;
        const start = anchor();
        return {
            today: isSameDate(date, todayDate),
            selected,
            disabled: isOutOfBounds(date),
            unavailable: option("isDateUnavailable")?.(date) ?? false,
            outsideMonth,
            focused: !outsideMonth && isSameDate(date, focusedDate()),
            rangeStart:
                rangeValue !== null && isSameDate(date, rangeValue.start),
            rangeEnd: rangeValue !== null && isSameDate(date, rangeValue.end),
            inRange,
            rangePreview:
                start !== null &&
                isBetween(date, start, hovered() ?? focusedDate()),
        };
    };

    // a pending focus lands on the focused date's cell once it is registered; a cell that
    // registers later (a new month, a picker opening) takes it itself (calendar-cell.tsx)
    createEffect(
        () => ({
            date: focusedDate(),
            request: focusRequests(),
            canFocus: canTakeFocus(),
        }),
        ({ date, canFocus }) => {
            if (!focusPending.current || !canFocus) {
                return;
            }
            const cell = cells.get(toIsoDate(date));
            if (cell) {
                focusPending.current = false;
                cell.focus({ preventScroll: true });
            }
        },
    );

    return {
        mode,
        locale,
        firstDay,
        visibleMonths,
        visibleStart,
        focusedDate,
        disabled,
        readOnly,
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
        setHovered: (date) => setHovered(date),
        cells,
        requestFocus: () => {
            focusPending.current = true;
            setFocusRequests((count) => count + 1);
        },
        focusPending,
        canTakeFocus,
    };
}
