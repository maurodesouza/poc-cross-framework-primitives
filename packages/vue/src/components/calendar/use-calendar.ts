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
} from "@poc/dom";
import { computed, inject, shallowRef, useId } from "vue";
import { useControllable } from "../../composables/use-controllable.ts";
import type { ChangeDetails } from "../../utils/change-details.ts";
import { DatePickerKey } from "../date-picker/date-picker-context.ts";
import type { CalendarContext, CellState } from "./calendar-context.ts";
import {
    type CalendarMode,
    type CalendarOptions,
    type CalendarValue,
    isRange,
} from "./calendar-value.ts";

export interface CalendarStateProps extends CalendarOptions {
    value?: CalendarValue;
    defaultValue?: CalendarValue;
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
export function useCalendar(
    mode: CalendarMode,
    props: CalendarStateProps,
    onChange: (value: CalendarValue, details: ChangeDetails) => void,
): { context: CalendarContext; bound: boolean } {
    const picker = inject(DatePickerKey, null);
    const bound =
        picker !== null &&
        props.value === undefined &&
        props.defaultValue === undefined;
    const option = <K extends keyof CalendarOptions>(
        key: K,
    ): CalendarOptions[K] =>
        props[key] !== undefined
            ? props[key]
            : bound
              ? picker?.options()[key]
              : undefined;
    const own = useControllable<CalendarValue, ChangeDetails>(
        () => props.value,
        props.defaultValue ?? null,
        onChange,
    );
    const value = computed<CalendarValue>(() =>
        bound && picker ? picker.value.value : own.value.value,
    );
    const min = () => option("min") ?? null;
    const max = () => option("max") ?? null;
    const locale = () => option("locale") ?? documentLocale();
    const firstDay = () => option("firstDayOfWeek") ?? firstDayOfWeek(locale());
    const visibleMonths = () => Math.max(1, option("visibleMonths") ?? 1);
    const todayDate = today();
    const initial = value.value;
    const initialFocus = clampDate(
        (isRange(initial) ? initial.start : initial) ?? todayDate,
        min(),
        max(),
    );
    const focusedDate = shallowRef(initialFocus);
    const visibleStart = shallowRef(startOfMonth(initialFocus));
    const anchor = shallowRef<PlainDate | null>(null);
    const hovered = shallowRef<PlainDate | null>(null);
    const focusPending = { current: bound };
    const baseId = useId();

    const isOutOfBounds = (date: PlainDate) =>
        (props.disabled ?? false) || !isWithinBounds(date, min(), max());
    const commit = (next: CalendarValue) => {
        if (bound && picker) {
            picker.choose(next);
        } else {
            own.set(next, { reason: "item-press" });
        }
    };
    const rangeValue = (): DateRange | null =>
        isRange(value.value) ? value.value : null;

    const context: CalendarContext = {
        mode,
        locale,
        firstDay,
        visibleMonths,
        visibleStart,
        focusedDate,
        disabled: () => props.disabled ?? false,
        readOnly: () => props.readOnly ?? false,
        headingId: (offset) => `${baseId}-heading-${offset}`,
        gridId: (offset) => `${baseId}-grid-${offset}`,
        cellState(date, month): CellState {
            const outsideMonth = !isSameMonth(date, month);
            const range = rangeValue();
            const inRange =
                range !== null && isBetween(date, range.start, range.end);
            const current = value.value;
            const selected =
                mode === "single"
                    ? !isRange(current) && isSameDate(current, date)
                    : inRange;
            const previewTo = hovered.value ?? focusedDate.value;
            return {
                today: isSameDate(date, todayDate),
                selected,
                disabled: isOutOfBounds(date),
                unavailable: option("isDateUnavailable")?.(date) ?? false,
                outsideMonth,
                focused: !outsideMonth && isSameDate(date, focusedDate.value),
                rangeStart: range !== null && isSameDate(date, range.start),
                rangeEnd: range !== null && isSameDate(date, range.end),
                inRange,
                rangePreview:
                    anchor.value !== null &&
                    isBetween(date, anchor.value, previewTo),
            };
        },
        moveFocus(date) {
            if (isOutOfBounds(date)) {
                return false;
            }
            focusedDate.value = date;
            const offset = monthsBetween(visibleStart.value, date);
            if (offset < 0) {
                visibleStart.value = startOfMonth(date);
            } else if (offset >= visibleMonths()) {
                visibleStart.value = addMonths(
                    startOfMonth(date),
                    -(visibleMonths() - 1),
                );
            }
            return true;
        },
        canPage(delta) {
            const start = addMonths(
                visibleStart.value,
                delta * visibleMonths(),
            );
            const end = endOfMonth(addMonths(start, visibleMonths() - 1));
            const upper = max();
            const lower = min();
            return (
                (upper === null || compareDates(start, upper) <= 0) &&
                (lower === null || compareDates(end, lower) >= 0)
            );
        },
        page(delta) {
            if (!context.canPage(delta)) {
                return;
            }
            visibleStart.value = addMonths(
                visibleStart.value,
                delta * visibleMonths(),
            );
            focusedDate.value = clampDate(
                addMonths(focusedDate.value, delta * visibleMonths()),
                min(),
                max(),
            );
        },
        select(date) {
            if (
                isOutOfBounds(date) ||
                option("isDateUnavailable")?.(date) ||
                (props.readOnly ?? false)
            ) {
                return;
            }
            focusedDate.value = date;
            if (mode === "single") {
                commit(date);
                return;
            }
            if (anchor.value === null) {
                anchor.value = date;
                return;
            }
            const [start, end] =
                compareDates(anchor.value, date) <= 0
                    ? [anchor.value, date]
                    : [date, anchor.value];
            anchor.value = null;
            hovered.value = null;
            commit({ start, end });
        },
        anchor,
        cancelRange() {
            anchor.value = null;
            hovered.value = null;
        },
        setHovered(date) {
            hovered.value = date;
        },
        cells: new Map(),
        rangeValue,
        requestFocus() {
            focusPending.current = true;
        },
        focusPending,
    };
    return { context, bound };
}
