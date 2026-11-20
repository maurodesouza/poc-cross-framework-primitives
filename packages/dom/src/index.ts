// @poc/dom: framework-free DOM behaviours and pure math (AGENTS.md rule 2). Never component state.

export {
    edgeIndex,
    type NavigationOptions,
    stepIndex,
} from "./collection/list-navigation.ts";
export { createTypeahead } from "./collection/typeahead.ts";
export {
    addDays,
    addMonths,
    addYears,
    clampDate,
    dayOfWeek,
    daysInMonth,
    endOfMonth,
    endOfWeek,
    isBetween,
    isWithinBounds,
    monthsBetween,
    startOfMonth,
    startOfWeek,
} from "./date/date-math.ts";
export {
    firstDayOfWeek,
    formatDayNumber,
    formatFullDate,
    formatMonthYear,
    type Weekday,
    weekdays,
} from "./date/locale-data.ts";
export { monthGrid } from "./date/month-grid.ts";
export {
    compareDates,
    type DateRange,
    fromIsoDate,
    isSameDate,
    isSameMonth,
    type PlainDate,
    plainDate,
    today,
    toIsoDate,
    toLocalDate,
} from "./date/plain-date.ts";
export { type Direction, getDirection } from "./direction/direction.ts";
export { focusInitial, trapFocus } from "./focus/focus-trap.ts";
export { isKeyboardModality } from "./focus/focus-visible.ts";
export {
    getTabbables,
    nextTabbableAfter,
    previousTabbableBefore,
} from "./focus/tabbable.ts";
export { createId } from "./id/create-id.ts";
export { inertOutside } from "./inert/inert-outside.ts";
export { watchFocusOutside } from "./layers/focus-outside.ts";
export {
    type Layer,
    type LayerOptions,
    pushLayer,
} from "./layers/layer-stack.ts";
export {
    type AnchorOptions,
    anchorFloating,
} from "./positioning/anchor-floating.ts";
export {
    type Align,
    fromPlacement,
    type Side,
    toPlacement,
} from "./positioning/placement.ts";
export { nextFrame, waitForAnimations } from "./presence/presence.ts";
export { lockScroll } from "./scroll-lock/lock-scroll.ts";
