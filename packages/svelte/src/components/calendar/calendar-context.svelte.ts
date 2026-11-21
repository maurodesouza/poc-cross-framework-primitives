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
import type { ChangeDetails } from "../../utils/change-details.ts";
import { createContext } from "../../utils/context.ts";
import { Controllable } from "../../utils/controllable.svelte.ts";
import type { DatePickerState } from "../date-picker/date-picker-context.svelte.ts";
import {
    type CalendarMode,
    type CalendarOptions,
    type CalendarValue,
    isRange,
} from "./calendar-value.ts";

export interface CellState {
    today: boolean;
    selected: boolean;
    disabled: boolean;
    unavailable: boolean;
    outsideMonth: boolean;
    focused: boolean;
    rangeStart: boolean;
    rangeEnd: boolean;
    inRange: boolean;
    rangePreview: boolean;
}

export interface CalendarProps extends CalendarOptions {
    value?: CalendarValue;
    defaultValue?: CalendarValue;
    disabled?: boolean;
    readOnly?: boolean;
}

let counter = 0;

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
export class CalendarState {
    focusedDate = $state() as PlainDate;
    visibleStart = $state() as PlainDate;
    anchor = $state<PlainDate | null>(null);
    hovered = $state<PlainDate | null>(null);
    readonly cells = new Map<string, HTMLElement>();
    readonly focusPending: { current: boolean };
    readonly bound: boolean;
    readonly todayDate = today();
    readonly baseId: string;
    readonly #own: Controllable<CalendarValue>;

    constructor(
        readonly mode: CalendarMode,
        readonly props: () => CalendarProps,
        write: (value: CalendarValue) => void,
        readonly onValueChange: () =>
            | ((value: CalendarValue, details: ChangeDetails) => void)
            | undefined,
        readonly picker: DatePickerState | null,
        initialValue: CalendarValue | undefined,
        initialDefault: CalendarValue | undefined,
    ) {
        this.bound =
            picker !== null &&
            initialValue === undefined &&
            initialDefault === undefined;
        this.#own = new Controllable(
            () => this.props().value,
            write,
            initialDefault ?? null,
        );
        this.focusPending = { current: this.bound };
        counter += 1;
        this.baseId = `poc-calendar-${counter}`;
        const value = this.value;
        const initial = clampDate(
            (isRange(value) ? value.start : value) ?? this.todayDate,
            this.min,
            this.max,
        );
        this.focusedDate = initial;
        this.visibleStart = startOfMonth(initial);
    }

    option<K extends keyof CalendarOptions>(key: K): CalendarOptions[K] {
        const own = this.props()[key];
        return own !== undefined
            ? own
            : this.bound
              ? this.picker?.options()[key]
              : undefined;
    }

    get value(): CalendarValue {
        return this.bound && this.picker ? this.picker.value : this.#own.value;
    }
    get min(): PlainDate | null {
        return this.option("min") ?? null;
    }
    get max(): PlainDate | null {
        return this.option("max") ?? null;
    }
    get locale(): string {
        return this.option("locale") ?? documentLocale();
    }
    get firstDay(): number {
        return this.option("firstDayOfWeek") ?? firstDayOfWeek(this.locale);
    }
    get visibleMonths(): number {
        return Math.max(1, this.option("visibleMonths") ?? 1);
    }
    get disabled(): boolean {
        return this.props().disabled ?? false;
    }
    get readOnly(): boolean {
        return this.props().readOnly ?? false;
    }
    get rangeValue(): DateRange | null {
        const value = this.value;
        return isRange(value) ? value : null;
    }

    headingId(offset: number): string {
        return `${this.baseId}-heading-${offset}`;
    }
    gridId(offset: number): string {
        return `${this.baseId}-grid-${offset}`;
    }

    isOutOfBounds(date: PlainDate): boolean {
        return this.disabled || !isWithinBounds(date, this.min, this.max);
    }

    cellState(date: PlainDate, month: PlainDate): CellState {
        const outsideMonth = !isSameMonth(date, month);
        const range = this.rangeValue;
        const inRange =
            range !== null && isBetween(date, range.start, range.end);
        const value = this.value;
        const selected =
            this.mode === "single"
                ? !isRange(value) && isSameDate(value, date)
                : inRange;
        const previewTo = this.hovered ?? this.focusedDate;
        return {
            today: isSameDate(date, this.todayDate),
            selected,
            disabled: this.isOutOfBounds(date),
            unavailable: this.option("isDateUnavailable")?.(date) ?? false,
            outsideMonth,
            focused: !outsideMonth && isSameDate(date, this.focusedDate),
            rangeStart: range !== null && isSameDate(date, range.start),
            rangeEnd: range !== null && isSameDate(date, range.end),
            inRange,
            rangePreview:
                this.anchor !== null && isBetween(date, this.anchor, previewTo),
        };
    }

    moveFocus(date: PlainDate): boolean {
        if (this.isOutOfBounds(date)) {
            return false;
        }
        this.focusedDate = date;
        const offset = monthsBetween(this.visibleStart, date);
        if (offset < 0) {
            this.visibleStart = startOfMonth(date);
        } else if (offset >= this.visibleMonths) {
            this.visibleStart = addMonths(
                startOfMonth(date),
                -(this.visibleMonths - 1),
            );
        }
        return true;
    }

    canPage(delta: 1 | -1): boolean {
        const start = addMonths(this.visibleStart, delta * this.visibleMonths);
        const end = endOfMonth(addMonths(start, this.visibleMonths - 1));
        const { min, max } = this;
        return (
            (max === null || compareDates(start, max) <= 0) &&
            (min === null || compareDates(end, min) >= 0)
        );
    }

    page(delta: 1 | -1): void {
        if (!this.canPage(delta)) {
            return;
        }
        this.visibleStart = addMonths(
            this.visibleStart,
            delta * this.visibleMonths,
        );
        this.focusedDate = clampDate(
            addMonths(this.focusedDate, delta * this.visibleMonths),
            this.min,
            this.max,
        );
    }

    #commit(next: CalendarValue): void {
        if (this.bound && this.picker) {
            this.picker.choose(next);
        } else if (this.#own.set(next)) {
            this.onValueChange()?.(next, { reason: "item-press" });
        }
    }

    select(date: PlainDate): void {
        if (
            this.isOutOfBounds(date) ||
            this.option("isDateUnavailable")?.(date) ||
            this.readOnly
        ) {
            return;
        }
        this.focusedDate = date;
        if (this.mode === "single") {
            this.#commit(date);
            return;
        }
        if (this.anchor === null) {
            this.anchor = date;
            return;
        }
        const [start, end] =
            compareDates(this.anchor, date) <= 0
                ? [this.anchor, date]
                : [date, this.anchor];
        this.anchor = null;
        this.hovered = null;
        this.#commit({ start, end });
    }

    cancelRange(): void {
        this.anchor = null;
        this.hovered = null;
    }

    requestFocus(): void {
        this.focusPending.current = true;
    }
}

export const CalendarContext = createContext<CalendarState>("Calendar");

/** The month a grid shows (`offset` months after the first visible one). */
export const CalendarGridContext =
    createContext<() => PlainDate>("CalendarGrid");
