import { PopoverArrow } from "./popover-arrow.tsx";
import { PopoverClose } from "./popover-close.tsx";
import { PopoverDescription } from "./popover-description.tsx";
import { PopoverPopup } from "./popover-popup.tsx";
import { PopoverPortal } from "./popover-portal.tsx";
import { PopoverPositioner } from "./popover-positioner.tsx";
import { PopoverRoot } from "./popover-root.tsx";
import { PopoverTitle } from "./popover-title.tsx";
import { PopoverTrigger } from "./popover-trigger.tsx";

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
