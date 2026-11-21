import type { Component } from "solid-js";
import { CalendarMinMax } from "../scenarios/calendar/calendar-min-max.tsx";
import { CalendarRange } from "../scenarios/calendar/calendar-range.tsx";
import { CalendarSingle } from "../scenarios/calendar/calendar-single.tsx";
import { CalendarTwoMonths } from "../scenarios/calendar/calendar-two-months.tsx";
import { CalendarUnavailable } from "../scenarios/calendar/calendar-unavailable.tsx";
import { CheckboxBasic } from "../scenarios/checkbox/checkbox-basic.tsx";
import { CheckboxControlled } from "../scenarios/checkbox/checkbox-controlled.tsx";
import { CheckboxGroupScenario } from "../scenarios/checkbox/checkbox-group.tsx";
import { ComboboxBasic } from "../scenarios/combobox/combobox-basic.tsx";
import { ComboboxControlled } from "../scenarios/combobox/combobox-controlled.tsx";
import { ComboboxRejectedInput } from "../scenarios/combobox/combobox-rejected-input.tsx";
import { DatePickerBasic } from "../scenarios/date-picker/date-picker-basic.tsx";
import { DatePickerRange } from "../scenarios/date-picker/date-picker-range.tsx";
import { DialogBasic } from "../scenarios/dialog/dialog-basic.tsx";
import { DialogControlled } from "../scenarios/dialog/dialog-controlled.tsx";
import { DialogInitialFocus } from "../scenarios/dialog/dialog-initial-focus.tsx";
import { DialogNestedPopover } from "../scenarios/dialog/dialog-nested-popover.tsx";
import { DialogRejectedClose } from "../scenarios/dialog/dialog-rejected-close.tsx";
import { FieldBasic } from "../scenarios/field/field-basic.tsx";
import { FieldControls } from "../scenarios/field/field-controls.tsx";
import { FieldValidation } from "../scenarios/field/field-validation.tsx";
import { MenuBasic } from "../scenarios/menu/menu-basic.tsx";
import { MenuGroups } from "../scenarios/menu/menu-groups.tsx";
import { MenuSubmenu } from "../scenarios/menu/menu-submenu.tsx";
import { PopoverArrow } from "../scenarios/popover/popover-arrow.tsx";
import { PopoverBasic } from "../scenarios/popover/popover-basic.tsx";
import { PopoverPlacement } from "../scenarios/popover/popover-placement.tsx";
import { PopoverRtl } from "../scenarios/popover/popover-rtl.tsx";
import { SelectBasic } from "../scenarios/select/select-basic.tsx";
import { SelectControlled } from "../scenarios/select/select-controlled.tsx";
import { SliderBasic } from "../scenarios/slider/slider-basic.tsx";
import { SliderControlled } from "../scenarios/slider/slider-controlled.tsx";
import { SliderRange } from "../scenarios/slider/slider-range.tsx";
import { SliderVertical } from "../scenarios/slider/slider-vertical.tsx";
import { TabsAutomatic } from "../scenarios/tabs/tabs-automatic.tsx";
import { TabsManual } from "../scenarios/tabs/tabs-manual.tsx";
import { TabsVertical } from "../scenarios/tabs/tabs-vertical.tsx";
import { TooltipBasic } from "../scenarios/tooltip/tooltip-basic.tsx";
import { TooltipGroup } from "../scenarios/tooltip/tooltip-group.tsx";

/** Every scenario of the specs, at `/<component>/<scenario>`. */
export const routes: Record<string, Component<{ locale: string }>> = {
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
    "/field/basic": FieldBasic,
    "/field/validation": FieldValidation,
    "/field/controls": FieldControls,
};
