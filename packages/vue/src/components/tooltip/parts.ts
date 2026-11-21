import { TooltipArrow } from "./tooltip-arrow.ts";
import { TooltipPopup } from "./tooltip-popup.ts";
import { TooltipPortal } from "./tooltip-portal.ts";
import { TooltipPositioner } from "./tooltip-positioner.ts";
import { TooltipProvider } from "./tooltip-provider.ts";
import { TooltipRoot } from "./tooltip-root.ts";
import { TooltipTrigger } from "./tooltip-trigger.ts";

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
