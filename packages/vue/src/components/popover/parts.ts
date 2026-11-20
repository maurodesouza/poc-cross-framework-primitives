import { PopoverArrow } from "./popover-arrow.ts";
import { PopoverClose } from "./popover-close.ts";
import { PopoverDescription } from "./popover-description.ts";
import { PopoverPopup } from "./popover-popup.ts";
import { PopoverPortal } from "./popover-portal.ts";
import { PopoverPositioner } from "./popover-positioner.ts";
import { PopoverRoot } from "./popover-root.ts";
import { PopoverTitle } from "./popover-title.ts";
import { PopoverTrigger } from "./popover-trigger.ts";

/** spec/popover.md */
export const Popover = {
    Root: PopoverRoot,
    Trigger: PopoverTrigger,
    Portal: PopoverPortal,
    Positioner: PopoverPositioner,
    Popup: PopoverPopup,
    Arrow: PopoverArrow,
    Title: PopoverTitle,
    Description: PopoverDescription,
    Close: PopoverClose,
};
