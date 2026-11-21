import type { Component } from "svelte";
import DialogBasic from "../scenarios/dialog/dialog-basic.svelte";
import DialogControlled from "../scenarios/dialog/dialog-controlled.svelte";
import DialogInitialFocus from "../scenarios/dialog/dialog-initial-focus.svelte";
import DialogNestedPopover from "../scenarios/dialog/dialog-nested-popover.svelte";
import MenuBasic from "../scenarios/menu/menu-basic.svelte";
import MenuGroups from "../scenarios/menu/menu-groups.svelte";
import MenuSubmenu from "../scenarios/menu/menu-submenu.svelte";
import PopoverArrow from "../scenarios/popover/popover-arrow.svelte";
import PopoverBasic from "../scenarios/popover/popover-basic.svelte";
import PopoverPlacement from "../scenarios/popover/popover-placement.svelte";
import PopoverRtl from "../scenarios/popover/popover-rtl.svelte";

/** Every scenario of the specs, at `/<component>/<scenario>`. */
// biome-ignore lint/suspicious/noExplicitAny: scenarios take different props
export const routes: Record<string, Component<any>> = {
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
