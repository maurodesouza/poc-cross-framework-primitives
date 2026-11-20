import type { Component } from "vue";
import DialogBasic from "../scenarios/dialog/dialog-basic.vue";
import DialogControlled from "../scenarios/dialog/dialog-controlled.vue";
import DialogInitialFocus from "../scenarios/dialog/dialog-initial-focus.vue";
import DialogNestedPopover from "../scenarios/dialog/dialog-nested-popover.vue";
import MenuBasic from "../scenarios/menu/menu-basic.vue";
import MenuGroups from "../scenarios/menu/menu-groups.vue";
import MenuSubmenu from "../scenarios/menu/menu-submenu.vue";
import PopoverArrow from "../scenarios/popover/popover-arrow.vue";
import PopoverBasic from "../scenarios/popover/popover-basic.vue";
import PopoverPlacement from "../scenarios/popover/popover-placement.vue";
import PopoverRtl from "../scenarios/popover/popover-rtl.vue";

/** Every scenario of the specs, at `/<component>/<scenario>`. */
export const routes: Record<string, Component> = {
    "/dialog/basic": DialogBasic,
    "/dialog/initial-focus": DialogInitialFocus,
    "/dialog/nested-popover": DialogNestedPopover,
    "/dialog/controlled": DialogControlled,
    "/popover/basic": PopoverBasic,
    "/popover/placement": PopoverPlacement,
    "/popover/rtl": PopoverRtl,
    "/popover/arrow": PopoverArrow,
    "/menu/basic": MenuBasic,
    "/menu/submenu": MenuSubmenu,
    "/menu/groups": MenuGroups,
};
