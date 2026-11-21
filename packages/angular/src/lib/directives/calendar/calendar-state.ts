import {
    afterEveryRender,
    computed,
    InjectionToken,
    inject,
    type ModelSignal,
    type Signal,
    signal,
    untracked,
} from "@angular/core";
import {
    addMonths,
    clampDate,
    compareDates,
    createId,
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
import type { ChangeDetails } from "../../utils/change-details.ts";
import { controllable } from "../../utils/controllable.ts";
import { DATE_PICKER } from "../date-picker/date-picker-state.ts";
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

/** The inputs a Calendar or RangeCalendar root hands its state (spec/calendar.md). */
export interface CalendarInputs {
    value: ModelSignal<CalendarValue | undefined>;
    defaultValue: Signal<CalendarValue | undefined>;
    min: Signal<PlainDate | null | undefined>;
    max: Signal<PlainDate | null | undefined>;
    isDateUnavailable: Signal<((date: PlainDate) => boolean) | undefined>;
    locale: Signal<string | undefined>;
    firstDayOfWeek: Signal<number | undefined>;
    visibleMonths: Signal<number | undefined>;
    disabled: Signal<boolean>;
    readOnly: Signal<boolean>;
}

/** The enclosing calendar's state, for its parts (provided by both roots). */
export const CALENDAR = new InjectionToken<CalendarState>("CALENDAR");

function documentLocale(): string {
    if (typeof document !== "undefined" && document.documentElement.lang) {
        return document.documentElement.lang;
    }
    return typeof navigator !== "undefined" ? navigator.language : "en-US";
}

/**
 * The state of a Calendar or RangeCalendar (spec/calendar.md): the focused date and the visible
 * months, the value (its own, or a picker's when it sits in one with no value of its own), and
 * the range being chosen. Created in a root directive's injection context.
 */
export class CalendarState {
    private readonly picker = inject(DATE_PICKER, { optional: true });
    /** In a picker, with no value of its own: the picker's value and options. */
    readonly bound = computed(
        () =>
            this.picker !== null &&
            this.inputs.value() === undefined &&
            this.inputs.defaultValue() === undefined,
    );
    private readonly own = controllable<CalendarValue, ChangeDetails>(
        this.inputs.value,
        () => this.inputs.defaultValue() ?? null,
        (value, details) => this.emit(value, details),
    );
    readonly value = computed<CalendarValue>(() =>
        this.bound() && this.picker ? this.picker.value() : this.own.value(),
    );
    private readonly options = computed<CalendarOptions>(() => {
        const own: CalendarOptions = {
            min: this.inputs.min(),
            max: this.inputs.max(),
            isDateUnavailable: this.inputs.isDateUnavailable(),
            locale: this.inputs.locale(),
            firstDayOfWeek: this.inputs.firstDayOfWeek(),
            visibleMonths: this.inputs.visibleMonths(),
        };
        if (!this.bound() || this.picker === null) {
            return own;
        }
        const merged: CalendarOptions = { ...this.picker.options() };
        for (const [key, value] of Object.entries(own)) {
            if (value !== undefined) {
                (merged as Record<string, unknown>)[key] = value;
            }
        }
        return merged;
    });
    readonly min = computed(() => this.options().min ?? null);
    readonly max = computed(() => this.options().max ?? null);
    readonly locale = computed(() => this.options().locale ?? documentLocale());
    readonly firstDay = computed(
        () => this.options().firstDayOfWeek ?? firstDayOfWeek(this.locale()),
    );
    readonly visibleMonths = computed(() =>
        Math.max(1, this.options().visibleMonths ?? 1),
    );
    readonly disabled = computed(() => this.inputs.disabled());
    readonly readOnly = computed(() => this.inputs.readOnly());
    readonly todayDate = today();
    private seed: PlainDate | null = null;
    private readonly focusedOwn = signal<PlainDate | null>(null);
    private readonly visibleOwn = signal<PlainDate | null>(null);
    /** The focused date: seeded once from the value (or today), clamped to the bounds. */
    readonly focusedDate = computed(
        () => this.focusedOwn() ?? this.initialFocus(),
    );
    /** The first visible month (day 1). */
    readonly visibleStart = computed(
        () => this.visibleOwn() ?? startOfMonth(this.initialFocus()),
    );
    /** RangeCalendar: the start of a range being chosen, and the date it previews to. */
    readonly anchor = signal<PlainDate | null>(null);
    readonly hovered = signal<PlainDate | null>(null);
    readonly rangeValue = computed<DateRange | null>(() => {
        const value = this.value();
        return isRange(value) ? value : null;
    });
    readonly cells = new Map<string, HTMLElement>();
    readonly baseId = createId("poc-calendar");
    /** Whether a focus is pending (`null`: not decided yet; a calendar in a picker starts with one). */
    private focusPending: boolean | null = null;

    constructor(
        readonly mode: CalendarMode,
        private readonly inputs: CalendarInputs,
        private readonly emit: (
            value: CalendarValue,
            details: ChangeDetails,
        ) => void,
    ) {
        // after every render while a focus is pending: the focused date's cell may mount later
        // than the keyboard moved to it (a new month, a picker opening)
        afterEveryRender(() => this.applyPendingFocus());
    }

    private initialFocus(): PlainDate {
        this.seed ??= untracked(() => {
            const value = this.value();
            return clampDate(
                (isRange(value) ? value.start : value) ?? this.todayDate,
                this.min(),
                this.max(),
            );
        });
        return this.seed;
    }

    headingId(offset: number): string {
        return `${this.baseId}-heading-${offset}`;
    }

    gridId(offset: number): string {
        return `${this.baseId}-grid-${offset}`;
    }

    isOutOfBounds(date: PlainDate): boolean {
        return this.disabled() || !isWithinBounds(date, this.min(), this.max());
    }

    isUnavailable(date: PlainDate): boolean {
        return this.options().isDateUnavailable?.(date) ?? false;
    }

    /** Moves the focused date (and the visible months); `false` when it is out of bounds. */
    moveFocus(date: PlainDate): boolean {
        if (this.isOutOfBounds(date)) {
            return false;
        }
        const visibleMonths = this.visibleMonths();
        const start = this.visibleStart();
        const offset = monthsBetween(start, date);
        this.focusedOwn.set(date);
        if (offset < 0) {
            this.visibleOwn.set(startOfMonth(date));
        } else if (offset >= visibleMonths) {
            this.visibleOwn.set(
                addMonths(startOfMonth(date), -(visibleMonths - 1)),
            );
        } else {
            this.visibleOwn.set(start);
        }
        return true;
    }

    canPage(delta: 1 | -1): boolean {
        const visibleMonths = this.visibleMonths();
        const start = addMonths(this.visibleStart(), delta * visibleMonths);
        const end = endOfMonth(addMonths(start, visibleMonths - 1));
        const min = this.min();
        const max = this.max();
        return (
            (max === null || compareDates(start, max) <= 0) &&
            (min === null || compareDates(end, min) >= 0)
        );
    }

    page(delta: 1 | -1): void {
        if (!this.canPage(delta)) {
            return;
        }
        const step = delta * this.visibleMonths();
        this.visibleOwn.set(addMonths(this.visibleStart(), step));
        this.focusedOwn.set(
            clampDate(
                addMonths(this.focusedDate(), step),
                this.min(),
                this.max(),
            ),
        );
    }

    private commit(next: CalendarValue): void {
        if (this.bound() && this.picker) {
            this.picker.choose(next);
        } else {
            this.own.set(next, { reason: "item-press" });
        }
    }

    select(date: PlainDate): void {
        if (
            this.isOutOfBounds(date) ||
            this.isUnavailable(date) ||
            this.readOnly()
        ) {
            return;
        }
        this.focusedOwn.set(date);
        if (this.mode === "single") {
            this.commit(date);
            return;
        }
        const anchor = this.anchor();
        if (anchor === null) {
            this.anchor.set(date);
            return;
        }
        const [start, end] =
            compareDates(anchor, date) <= 0 ? [anchor, date] : [date, anchor];
        this.anchor.set(null);
        this.hovered.set(null);
        this.commit({ start, end });
    }

    cancelRange(): void {
        this.anchor.set(null);
        this.hovered.set(null);
    }

    cellState(date: PlainDate, month: PlainDate): CellState {
        const value = this.value();
        const rangeValue = this.rangeValue();
        const anchor = this.anchor();
        const outsideMonth = !isSameMonth(date, month);
        const inRange =
            rangeValue !== null &&
            isBetween(date, rangeValue.start, rangeValue.end);
        const selected =
            this.mode === "single"
                ? !isRange(value) && isSameDate(value, date)
                : inRange;
        return {
            today: isSameDate(date, this.todayDate),
            selected,
            disabled: this.isOutOfBounds(date),
            unavailable: this.isUnavailable(date),
            outsideMonth,
            focused: !outsideMonth && isSameDate(date, this.focusedDate()),
            rangeStart:
                rangeValue !== null && isSameDate(date, rangeValue.start),
            rangeEnd: rangeValue !== null && isSameDate(date, rangeValue.end),
            inRange,
            rangePreview:
                anchor !== null &&
                isBetween(date, anchor, this.hovered() ?? this.focusedDate()),
        };
    }

    /** Asks for the focused date's cell to take focus once it is rendered. */
    requestFocus(): void {
        this.focusPending = true;
    }

    private applyPendingFocus(): void {
        untracked(() => {
            this.focusPending ??= this.bound();
            if (!this.focusPending) {
                return;
            }
            // a calendar inside a closing picker takes no focus: the picker returns it to its
            // trigger
            if (this.picker !== null && !this.picker.overlay.open()) {
                this.focusPending = false;
                return;
            }
            const cell = this.cells.get(toIsoDate(this.focusedDate()));
            if (cell?.isConnected) {
                this.focusPending = false;
                cell.focus({ preventScroll: true });
            }
        });
    }
}
