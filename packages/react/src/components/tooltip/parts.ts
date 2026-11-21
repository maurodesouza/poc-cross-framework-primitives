import { TooltipArrow } from "./tooltip-arrow.tsx";
import { TooltipPopup } from "./tooltip-popup.tsx";
import { TooltipPortal } from "./tooltip-portal.tsx";
import { TooltipPositioner } from "./tooltip-positioner.tsx";
import { TooltipProvider } from "./tooltip-provider.tsx";
import { TooltipRoot } from "./tooltip-root.tsx";
import { TooltipTrigger } from "./tooltip-trigger.tsx";

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
