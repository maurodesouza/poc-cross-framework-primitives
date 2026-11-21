import type { Component } from "vue";
import CalendarMinMax from "../scenarios/calendar/calendar-min-max.vue";
import CalendarRange from "../scenarios/calendar/calendar-range.vue";
import CalendarSingle from "../scenarios/calendar/calendar-single.vue";
import CalendarTwoMonths from "../scenarios/calendar/calendar-two-months.vue";
import CalendarUnavailable from "../scenarios/calendar/calendar-unavailable.vue";
import CheckboxBasic from "../scenarios/checkbox/checkbox-basic.vue";
import CheckboxControlled from "../scenarios/checkbox/checkbox-controlled.vue";
import CheckboxGroupScenario from "../scenarios/checkbox/checkbox-group.vue";
import ComboboxBasic from "../scenarios/combobox/combobox-basic.vue";
import ComboboxControlled from "../scenarios/combobox/combobox-controlled.vue";
import ComboboxRejectedInput from "../scenarios/combobox/combobox-rejected-input.vue";
import DatePickerBasic from "../scenarios/date-picker/date-picker-basic.vue";
import DatePickerRange from "../scenarios/date-picker/date-picker-range.vue";
import DialogBasic from "../scenarios/dialog/dialog-basic.vue";
import DialogControlled from "../scenarios/dialog/dialog-controlled.vue";
import DialogInitialFocus from "../scenarios/dialog/dialog-initial-focus.vue";
import DialogNestedPopover from "../scenarios/dialog/dialog-nested-popover.vue";
import DialogRejectedClose from "../scenarios/dialog/dialog-rejected-close.vue";
import MenuBasic from "../scenarios/menu/menu-basic.vue";
import MenuGroups from "../scenarios/menu/menu-groups.vue";
import MenuSubmenu from "../scenarios/menu/menu-submenu.vue";
import PopoverArrow from "../scenarios/popover/popover-arrow.vue";
import PopoverBasic from "../scenarios/popover/popover-basic.vue";
import PopoverPlacement from "../scenarios/popover/popover-placement.vue";
import PopoverRtl from "../scenarios/popover/popover-rtl.vue";
import SelectBasic from "../scenarios/select/select-basic.vue";
import SelectControlled from "../scenarios/select/select-controlled.vue";
import SliderBasic from "../scenarios/slider/slider-basic.vue";
import SliderControlled from "../scenarios/slider/slider-controlled.vue";
import SliderRange from "../scenarios/slider/slider-range.vue";
import SliderVertical from "../scenarios/slider/slider-vertical.vue";
import TabsAutomatic from "../scenarios/tabs/tabs-automatic.vue";
import TabsManual from "../scenarios/tabs/tabs-manual.vue";
import TabsVertical from "../scenarios/tabs/tabs-vertical.vue";
import TooltipBasic from "../scenarios/tooltip/tooltip-basic.vue";
import TooltipGroup from "../scenarios/tooltip/tooltip-group.vue";

/** Every scenario of the specs, at `/<component>/<scenario>`. */
export const routes: Record<string, Component> = {
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
    "/select/basic": SelectBasic,
    "/select/controlled": SelectControlled,
    "/tooltip/basic": TooltipBasic,
    "/tooltip/group": TooltipGroup,
    "/checkbox/basic": CheckboxBasic,
    "/checkbox/group": CheckboxGroupScenario,
    "/checkbox/controlled": CheckboxControlled,
    "/slider/basic": SliderBasic,
    "/slider/range": SliderRange,
    "/slider/vertical": SliderVertical,
    "/slider/rtl": SliderBasic,
    "/slider/controlled": SliderControlled,
};
