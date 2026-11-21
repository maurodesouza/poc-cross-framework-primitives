// @poc/dom: framework-free DOM behaviours and pure math (AGENTS.md rule 2). Never component state.

export {
    menuKeyTarget,
    submenuKeys,
    type TabsKeyOptions,
    tabsKeyTarget,
} from "./collection/key-maps.ts";
export {
    edgeIndex,
    type NavigationOptions,
    stepIndex,
    stepThroughNone,
} from "./collection/list-navigation.ts";
export { createTypeahead } from "./collection/typeahead.ts";
export {
    type CalendarKeyOptions,
    calendarKeyTarget,
} from "./date/calendar-keys.ts";
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
export {
    type FieldValidationMode,
    shownAfterChange,
    validatesOnChange,
} from "./form/field-change.ts";
export { fieldDescribedBy } from "./form/field-described-by.ts";
export {
    type FieldErrorMatch,
    fieldErrorShown,
} from "./form/field-error-shown.ts";
export { type FieldState, fieldStateAttributes } from "./form/field-state.ts";
export {
    CLEARED,
    type FieldValidate,
    type FieldValidation,
    type FieldValidity,
    UNVALIDATED,
    VALIDITY_KEYS,
    type ValidateFieldOptions,
    type ValidityKey,
    validateField,
} from "./form/field-validity.ts";
export {
    bridgeForm,
    type FormBridgeOptions,
} from "./form/form-bridge.ts";
export { onSubmitAttempt } from "./form/submit-attempt.ts";
export { VISUALLY_HIDDEN_INPUT_STYLE } from "./form/visually-hidden.ts";
export { createDelayGroup, type DelayGroup } from "./hover/delay-group.ts";
export { createHoverIntent, type HoverIntent } from "./hover/hover-intent.ts";
export { createId } from "./id/create-id.ts";
export { inertOutside } from "./inert/inert-outside.ts";
export { watchFocusOutside } from "./layers/focus-outside.ts";
export {
    type Layer,
    type LayerOptions,
    pushLayer,
} from "./layers/layer-stack.ts";
export {
    type DismissReason,
    type OverlaySession,
    type OverlaySessionOptions,
    openOverlaySession,
} from "./overlay/overlay-session.ts";
export {
    type DragSessionOptions,
    startDrag,
} from "./pointer/drag-session.ts";
export { isInHoverBridge } from "./pointer/hover-bridge.ts";
export { isInSafeArea, type Point } from "./pointer/safe-area.ts";
export {
    type HoverBridgeCallbacks,
    trackHoverBridge,
} from "./pointer/track-hover-bridge.ts";
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
export {
    fractionAlong,
    moveThumb,
    nearestThumb,
    type RangeOptions,
    snapToStep,
    type ThumbOptions,
    thumbBounds,
    valueAtFraction,
    valueToPercent,
} from "./range/range-math.ts";
export { type SliderKeyOptions, sliderKeyTarget } from "./range/slider-keys.ts";
export { lockScroll } from "./scroll-lock/lock-scroll.ts";
