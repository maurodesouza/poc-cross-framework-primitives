import TooltipArrow from "./tooltip-arrow.svelte";
import TooltipPopup from "./tooltip-popup.svelte";
import TooltipPortal from "./tooltip-portal.svelte";
import TooltipPositioner from "./tooltip-positioner.svelte";
import TooltipProvider from "./tooltip-provider.svelte";
import TooltipRoot from "./tooltip-root.svelte";
import TooltipTrigger from "./tooltip-trigger.svelte";

/** spec/tooltip.md */
export const Tooltip = {
    Provider: TooltipProvider,
    Root: TooltipRoot,
    Trigger: TooltipTrigger,
    Portal: TooltipPortal,
    Positioner: TooltipPositioner,
    Popup: TooltipPopup,
    Arrow: TooltipArrow,
};
