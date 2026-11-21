import { useContext } from "solid-js";
import { OverlayPortal, type PortalProps } from "../shared/overlay-portal.tsx";
import { PopoverContext } from "./popover-context.ts";

export type PopoverPortalProps = PortalProps;

export function PopoverPortal(props: PopoverPortalProps) {
    const context = useContext(PopoverContext);
    return (
        <OverlayPortal presence={context.presence} container={props.container}>
            {props.children}
        </OverlayPortal>
    );
}
