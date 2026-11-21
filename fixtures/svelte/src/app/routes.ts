import type { Component } from "svelte";
import CalendarMinMax from "../scenarios/calendar/calendar-min-max.svelte";
import CalendarRange from "../scenarios/calendar/calendar-range.svelte";
import CalendarSingle from "../scenarios/calendar/calendar-single.svelte";
import CalendarTwoMonths from "../scenarios/calendar/calendar-two-months.svelte";
import CalendarUnavailable from "../scenarios/calendar/calendar-unavailable.svelte";
import ComboboxBasic from "../scenarios/combobox/combobox-basic.svelte";
import ComboboxControlled from "../scenarios/combobox/combobox-controlled.svelte";
import ComboboxRejectedInput from "../scenarios/combobox/combobox-rejected-input.svelte";
import DatePickerBasic from "../scenarios/date-picker/date-picker-basic.svelte";
import DatePickerRange from "../scenarios/date-picker/date-picker-range.svelte";
import DialogBasic from "../scenarios/dialog/dialog-basic.svelte";
import DialogControlled from "../scenarios/dialog/dialog-controlled.svelte";
import DialogInitialFocus from "../scenarios/dialog/dialog-initial-focus.svelte";
import DialogNestedPopover from "../scenarios/dialog/dialog-nested-popover.svelte";
import DialogRejectedClose from "../scenarios/dialog/dialog-rejected-close.svelte";
import MenuBasic from "../scenarios/menu/menu-basic.svelte";
import MenuGroups from "../scenarios/menu/menu-groups.svelte";
import MenuSubmenu from "../scenarios/menu/menu-submenu.svelte";
import PopoverArrow from "../scenarios/popover/popover-arrow.svelte";
import PopoverBasic from "../scenarios/popover/popover-basic.svelte";
import PopoverPlacement from "../scenarios/popover/popover-placement.svelte";
import PopoverRtl from "../scenarios/popover/popover-rtl.svelte";
import TabsAutomatic from "../scenarios/tabs/tabs-automatic.svelte";
import TabsManual from "../scenarios/tabs/tabs-manual.svelte";
import TabsVertical from "../scenarios/tabs/tabs-vertical.svelte";

/** Every scenario of the specs, at `/<component>/<scenario>`. */
// biome-ignore lint/suspicious/noExplicitAny: scenarios take different props
export const routes: Record<string, Component<any>> = {
    "/dialog/basic": DialogBasic,
    "/dialog/initial-focus": DialogInitialFocus,
    "/dialog/nested-popover": DialogNestedPopover,
    "/dialog/controlled": DialogControlled,
    "/dialog/rejected-close": DialogRejectedClose,
    "/popover/basic": PopoverBasic,
    "/popover/placement": PopoverPlacement,
    "/popover/rtl": PopoverRtl,
    "/popover/arrow": PopoverArrow,
    "/menu/basic": MenuBasic,
    "/menu/submenu": MenuSubmenu,
    "/menu/groups": MenuGroups,
    "/combobox/basic": ComboboxBasic,
    "/combobox/controlled": ComboboxControlled,
    "/combobox/rejected-input": ComboboxRejectedInput,
    "/tabs/automatic": TabsAutomatic,
    "/tabs/manual": TabsManual,
    "/tabs/vertical": TabsVertical,
    "/calendar/single": CalendarSingle,
    "/calendar/min-max": CalendarMinMax,
    "/calendar/unavailable": CalendarUnavailable,
    "/calendar/locale": CalendarSingle,
    "/calendar/rtl": CalendarSingle,
    "/calendar/two-months": CalendarTwoMonths,
    "/calendar/range": CalendarRange,
    "/date-picker/basic": DatePickerBasic,
    "/date-picker/range": DatePickerRange,
};
