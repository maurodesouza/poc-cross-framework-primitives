import PopoverArrow from "./popover-arrow.svelte";
import PopoverClose from "./popover-close.svelte";
import PopoverDescription from "./popover-description.svelte";
import PopoverPopup from "./popover-popup.svelte";
import PopoverPortal from "./popover-portal.svelte";
import PopoverPositioner from "./popover-positioner.svelte";
import PopoverRoot from "./popover-root.svelte";
import PopoverTitle from "./popover-title.svelte";
import PopoverTrigger from "./popover-trigger.svelte";

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
