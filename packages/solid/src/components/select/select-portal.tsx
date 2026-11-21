import { useContext } from "solid-js";
import { OverlayPortal, type PortalProps } from "../shared/overlay-portal.tsx";
import { SelectContext } from "./select-context.ts";

export type SelectPortalProps = PortalProps;

export function SelectPortal(props: SelectPortalProps) {
    const context = useContext(SelectContext);
    return (
        <OverlayPortal presence={context.presence} container={props.container}>
            {props.children}
        </OverlayPortal>
    );
}
