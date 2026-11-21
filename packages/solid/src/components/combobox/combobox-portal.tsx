import { useContext } from "solid-js";
import { OverlayPortal, type PortalProps } from "../shared/overlay-portal.tsx";
import { ComboboxContext } from "./combobox-context.ts";

export type ComboboxPortalProps = PortalProps;

export function ComboboxPortal(props: ComboboxPortalProps) {
    const context = useContext(ComboboxContext);
    return (
        <OverlayPortal presence={context.presence} container={props.container}>
            {props.children}
        </OverlayPortal>
    );
}
