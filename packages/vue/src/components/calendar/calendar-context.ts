import type { DateRange, PlainDate } from "@poc/dom";
import type { InjectionKey, Ref } from "vue";
import type { CalendarMode } from "./calendar-value.ts";

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

export interface CalendarContext {
    mode: CalendarMode;
    locale: () => string;
    firstDay: () => number;
    visibleMonths: () => number;
    visibleStart: Ref<PlainDate>;
    focusedDate: Ref<PlainDate>;
    disabled: () => boolean;
    readOnly: () => boolean;
    headingId: (offset: number) => string;
    gridId: (offset: number) => string;
    cellState: (date: PlainDate, month: PlainDate) => CellState;
    moveFocus: (date: PlainDate) => boolean;
    page: (delta: 1 | -1) => void;
    canPage: (delta: 1 | -1) => boolean;
    select: (date: PlainDate) => void;
    anchor: Ref<PlainDate | null>;
    cancelRange: () => void;
    setHovered: (date: PlainDate | null) => void;
    cells: Map<string, HTMLElement>;
    rangeValue: () => DateRange | null;
    /** Asks for the focused date's cell to take focus once it is rendered. */
    requestFocus: () => void;
    focusPending: { current: boolean };
}

export const CalendarKey: InjectionKey<CalendarContext> = Symbol("Calendar");

/** The month a grid shows (`offset` months after the first visible one). */
export const CalendarGridKey: InjectionKey<Ref<PlainDate>> =
    Symbol("CalendarGrid");
