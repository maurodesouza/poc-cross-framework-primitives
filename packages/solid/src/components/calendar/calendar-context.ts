import type { PlainDate } from "@poc/dom";
import { createContext } from "solid-js";
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

export interface CalendarContextValue {
    mode: CalendarMode;
    locale: () => string;
    firstDay: () => number;
    visibleMonths: () => number;
    /** The first visible month (day 1). */
    visibleStart: () => PlainDate;
    focusedDate: () => PlainDate;
    disabled: () => boolean;
    readOnly: () => boolean;
    headingId: (offset: number) => string;
    gridId: (offset: number) => string;
    cellState: (date: PlainDate, month: PlainDate) => CellState;
    /** Moves the focused date (and the visible months); `false` when it is out of bounds. */
    moveFocus: (date: PlainDate) => boolean;
    page: (delta: 1 | -1) => void;
    canPage: (delta: 1 | -1) => boolean;
    select: (date: PlainDate) => void;
    /** RangeCalendar: the start of a range being chosen. */
    anchor: () => PlainDate | null;
    cancelRange: () => void;
    setHovered: (date: PlainDate | null) => void;
    cells: Map<string, HTMLElement>;
    /** Asks for the focused date's cell to take focus once it is rendered. */
    requestFocus: () => void;
    /** Whether a focus is pending (a cell that registers as the focused date takes it). */
    focusPending: { current: boolean };
    /** Whether a cell may take the pending focus (not while the calendar's picker closes). */
    canTakeFocus: () => boolean;
}

export const CalendarContext = createContext<CalendarContextValue>();

/** The month a grid shows (`offset` months after the first visible one). */
export const CalendarGridContext = createContext<() => PlainDate>();
