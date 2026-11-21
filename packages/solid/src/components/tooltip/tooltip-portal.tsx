import { useContext } from "solid-js";
import { OverlayPortal, type PortalProps } from "../shared/overlay-portal.tsx";
import { TooltipContext } from "./tooltip-context.ts";

export type TooltipPortalProps = PortalProps;

export function TooltipPortal(props: TooltipPortalProps) {
    const context = useContext(TooltipContext);
    return (
        <OverlayPortal presence={context.presence} container={props.container}>
            {props.children}
        </OverlayPortal>
    );
}
