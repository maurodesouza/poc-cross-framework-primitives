import {
    computed,
    DestroyRef,
    Directive,
    effect,
    inject,
    input,
} from "@angular/core";
import {
    formatDayNumber,
    formatFullDate,
    type PlainDate,
    toIsoDate,
} from "@poc/dom";
import { injectHost } from "../../utils/host-element.ts";
import { dataValues } from "../../utils/state-attributes.ts";
import { CalendarGrid } from "./calendar-grid.directive.ts";
import { CALENDAR, type CellState } from "./calendar-state.ts";

/**
 * One date: `<td calendarCell [date]="date" #cell="calendarCell">{{ cell.dayNumber() }}</td>`.
 * Its name and its number come from `Intl` (spec/calendar.md, the locale exception).
 */
@Directive({
    selector: "[calendarCell]",
    exportAs: "calendarCell",
    host: {
        role: "gridcell",
        "data-calendar-part": "cell",
        "[attr.aria-label]": "label()",
        "[attr.tabindex]":
            "state().outsideMonth ? null : state().focused ? 0 : -1",
        "[attr.aria-selected]": "state().selected ? 'true' : null",
        "[attr.aria-disabled]":
            "state().disabled || state().unavailable || state().outsideMonth ? 'true' : null",
        "[attr.aria-current]": "state().today ? 'date' : null",
        "[attr.data-today]": "data().today",
        "[attr.data-selected]": "data().selected",
        "[attr.data-disabled]": "data().disabled",
        "[attr.data-unavailable]": "data().unavailable",
        "[attr.data-outside-month]": "data()['outside-month']",
        "[attr.data-range-start]": "data()['range-start']",
        "[attr.data-range-end]": "data()['range-end']",
        "[attr.data-in-range]": "data()['in-range']",
        "[attr.data-range-preview]": "data()['range-preview']",
        "(click)": "onClick()",
        "(pointerenter)": "onPointerEnter()",
        "(focus)": "onFocus()",
    },
})
export class CalendarCell {
    private readonly calendar = inject(CALENDAR);
    private readonly grid = inject(CalendarGrid);
    readonly date = input.required<PlainDate>();
    readonly state = computed<CellState>(() =>
        this.calendar.cellState(this.date(), this.grid.month()),
    );
    /** The day's number, in the locale's digits: the cell's content. */
    readonly dayNumber = computed(() =>
        formatDayNumber(this.calendar.locale(), this.date()),
    );
    protected readonly label = computed(() =>
        formatFullDate(this.calendar.locale(), this.date()),
    );
    protected readonly data = computed(() => {
        const state = this.state();
        return dataValues({
            today: state.today,
            selected: state.selected,
            disabled: state.disabled,
            unavailable: state.unavailable,
            "outside-month": state.outsideMonth,
            "range-start": state.rangeStart,
            "range-end": state.rangeEnd,
            "in-range": state.inRange,
            "range-preview": state.rangePreview,
        });
    });

    constructor() {
        const host = injectHost();
        const cells = this.calendar.cells;
        let key: string | null = null;
        const release = () => {
            if (key !== null && cells.get(key) === host) {
                cells.delete(key);
            }
        };
        // registered under its date while it is in the shown month; the root focuses it when a
        // focus is pending
        effect(() => {
            release();
            key = this.state().outsideMonth ? null : toIsoDate(this.date());
            if (key !== null) {
                cells.set(key, host);
            }
        });
        inject(DestroyRef).onDestroy(release);
    }

    protected onClick(): void {
        const state = this.state();
        if (!state.outsideMonth && !state.disabled) {
            this.calendar.select(this.date());
            this.calendar.requestFocus();
        }
    }

    protected onPointerEnter(): void {
        if (this.calendar.anchor() !== null && !this.state().outsideMonth) {
            this.calendar.hovered.set(this.date());
        }
    }

    protected onFocus(): void {
        const state = this.state();
        if (!state.outsideMonth && !state.focused) {
            this.calendar.moveFocus(this.date());
        }
    }
}
