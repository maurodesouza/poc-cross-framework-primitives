import { useContext } from "solid-js";
import { OverlayPortal, type PortalProps } from "../shared/overlay-portal.tsx";
import { DialogContext } from "./dialog-context.ts";

export type DialogPortalProps = PortalProps;

/** Moves the backdrop and the popup to the end of `body` while the dialog is open or closing. */
export function DialogPortal(props: DialogPortalProps) {
    const context = useContext(DialogContext);
    return (
        <OverlayPortal presence={context.presence} container={props.container}>
            {props.children}
        </OverlayPortal>
    );
}
