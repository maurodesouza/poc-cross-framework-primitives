// @poc/angular: the POC's primitives for Angular 22 (standalone directives, signals, zoneless),
// written from scratch on @poc/dom and spec/ (AGENTS.md). Each part is an attribute directive on
// the consumer's own element; see spec/README.md, "API mapping by framework".

export type { Align, DateRange, PlainDate, Side, Weekday } from "@poc/dom";
export { CalendarCell } from "./lib/directives/calendar/calendar-cell.directive.ts";
export { CalendarGrid } from "./lib/directives/calendar/calendar-grid.directive.ts";
export { CalendarGridBody } from "./lib/directives/calendar/calendar-grid-body.directive.ts";
export { CalendarGridHeader } from "./lib/directives/calendar/calendar-grid-header.directive.ts";
export { CalendarHeaderCell } from "./lib/directives/calendar/calendar-header-cell.directive.ts";
export { CalendarHeading } from "./lib/directives/calendar/calendar-heading.directive.ts";
export { CalendarNextButton } from "./lib/directives/calendar/calendar-next-button.directive.ts";
export { CalendarPrevButton } from "./lib/directives/calendar/calendar-prev-button.directive.ts";
export { CalendarRoot } from "./lib/directives/calendar/calendar-root.directive.ts";
export { CalendarRow } from "./lib/directives/calendar/calendar-row.directive.ts";
export type { CellState } from "./lib/directives/calendar/calendar-state.ts";
export type { CalendarValue } from "./lib/directives/calendar/calendar-value.ts";
export { RangeCalendarRoot } from "./lib/directives/calendar/range-calendar-root.directive.ts";
export { ComboboxEmpty } from "./lib/directives/combobox/combobox-empty.directive.ts";
export { ComboboxInput } from "./lib/directives/combobox/combobox-input.directive.ts";
export {
    ComboboxItem,
    type ComboboxItemState,
} from "./lib/directives/combobox/combobox-item.directive.ts";
export { ComboboxList } from "./lib/directives/combobox/combobox-list.directive.ts";
export { ComboboxPopup } from "./lib/directives/combobox/combobox-popup.directive.ts";
export { ComboboxPortal } from "./lib/directives/combobox/combobox-portal.directive.ts";
export { ComboboxPositioner } from "./lib/directives/combobox/combobox-positioner.directive.ts";
export {
    type ComboboxItemInfo,
    ComboboxRoot,
    type ComboboxState,
} from "./lib/directives/combobox/combobox-root.directive.ts";
export { ComboboxTrigger } from "./lib/directives/combobox/combobox-trigger.directive.ts";
export { DatePickerPopup } from "./lib/directives/date-picker/date-picker-popup.directive.ts";
export { DatePickerPortal } from "./lib/directives/date-picker/date-picker-portal.directive.ts";
export { DatePickerPositioner } from "./lib/directives/date-picker/date-picker-positioner.directive.ts";
export { DatePickerRoot } from "./lib/directives/date-picker/date-picker-root.directive.ts";
export { DatePickerTrigger } from "./lib/directives/date-picker/date-picker-trigger.directive.ts";
export { DateRangePickerRoot } from "./lib/directives/date-picker/date-range-picker-root.directive.ts";
export {
    DialogBackdrop,
    type DialogBackdropState,
} from "./lib/directives/dialog/dialog-backdrop.directive.ts";
export { DialogClose } from "./lib/directives/dialog/dialog-close.directive.ts";
export { DialogDescription } from "./lib/directives/dialog/dialog-description.directive.ts";
export {
    DialogPopup,
    type DialogPopupState,
} from "./lib/directives/dialog/dialog-popup.directive.ts";
export { DialogPortal } from "./lib/directives/dialog/dialog-portal.directive.ts";
export {
    DialogRoot,
    type DialogState,
} from "./lib/directives/dialog/dialog-root.directive.ts";
export { DialogTitle } from "./lib/directives/dialog/dialog-title.directive.ts";
export {
    DialogTrigger,
    type DialogTriggerState,
} from "./lib/directives/dialog/dialog-trigger.directive.ts";
export { MenuGroup } from "./lib/directives/menu/menu-group.directive.ts";
export { MenuGroupLabel } from "./lib/directives/menu/menu-group-label.directive.ts";
export {
    MenuItem,
    type MenuItemState,
} from "./lib/directives/menu/menu-item.directive.ts";
export {
    MenuPopup,
    type MenuPopupState,
} from "./lib/directives/menu/menu-popup.directive.ts";
export { MenuPortal } from "./lib/directives/menu/menu-portal.directive.ts";
export {
    MenuPositioner,
    type MenuPositionerState,
} from "./lib/directives/menu/menu-positioner.directive.ts";
export {
    MenuRoot,
    type MenuState,
    type SafeArea,
} from "./lib/directives/menu/menu-root.directive.ts";
export { MenuSeparator } from "./lib/directives/menu/menu-separator.directive.ts";
export {
    MenuSubmenuTrigger,
    type MenuSubmenuTriggerState,
} from "./lib/directives/menu/menu-submenu-trigger.directive.ts";
export {
    MenuTrigger,
    type MenuTriggerState,
} from "./lib/directives/menu/menu-trigger.directive.ts";
export { PopoverArrow } from "./lib/directives/popover/popover-arrow.directive.ts";
export { PopoverClose } from "./lib/directives/popover/popover-close.directive.ts";
export { PopoverDescription } from "./lib/directives/popover/popover-description.directive.ts";
export {
    PopoverPopup,
    type PopoverPopupState,
} from "./lib/directives/popover/popover-popup.directive.ts";
export { PopoverPortal } from "./lib/directives/popover/popover-portal.directive.ts";
export {
    PopoverPositioner,
    type PopoverPositionerState,
} from "./lib/directives/popover/popover-positioner.directive.ts";
export {
    PopoverRoot,
    type PopoverState,
} from "./lib/directives/popover/popover-root.directive.ts";
export { PopoverTitle } from "./lib/directives/popover/popover-title.directive.ts";
export {
    PopoverTrigger,
    type PopoverTriggerState,
} from "./lib/directives/popover/popover-trigger.directive.ts";
export { TabsIndicator } from "./lib/directives/tabs/tabs-indicator.directive.ts";
export { TabsList } from "./lib/directives/tabs/tabs-list.directive.ts";
export {
    TabsPanel,
    type TabsPanelState,
} from "./lib/directives/tabs/tabs-panel.directive.ts";
export {
    type TabInfo,
    TabsRoot,
    type TabsRootState,
} from "./lib/directives/tabs/tabs-root.directive.ts";
export {
    TabsTab,
    type TabsTabState,
} from "./lib/directives/tabs/tabs-tab.directive.ts";
export { injectCalendar } from "./lib/inject/inject-calendar.ts";
export { injectCombobox } from "./lib/inject/inject-combobox.ts";
export { injectDatePicker } from "./lib/inject/inject-date-picker.ts";
export { injectDialog } from "./lib/inject/inject-dialog.ts";
export { injectMenu } from "./lib/inject/inject-menu.ts";
export { injectPopover } from "./lib/inject/inject-popover.ts";
export { injectTabs } from "./lib/inject/inject-tabs.ts";
export type {
    ChangeDetails,
    ChangeReason,
    FocusTarget,
    OpenChangeEvent,
    ValueChangeEvent,
} from "./lib/utils/change-details.ts";
