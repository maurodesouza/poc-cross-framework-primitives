// @poc/angular: the POC's primitives for Angular 22 (standalone directives, signals, zoneless),
// written from scratch on @poc/dom and spec/ (AGENTS.md). Each part is an attribute directive on
// the consumer's own element; see spec/README.md, "API mapping by framework".

export type { Align, DateRange, PlainDate, Side } from "@poc/dom";
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
export { injectDialog } from "./lib/inject/inject-dialog.ts";
export type {
    ChangeDetails,
    ChangeReason,
    FocusTarget,
    OpenChangeEvent,
    ValueChangeEvent,
} from "./lib/utils/change-details.ts";
