import { OverlayPortal, type PortalProps } from "../shared/overlay-portal.tsx";
import { usePicker } from "./use-picker.ts";

export type DatePickerPortalProps = PortalProps;

export function DatePickerPortal(props: DatePickerPortalProps) {
    const context = usePicker("DatePicker.Portal");
    return (
        <OverlayPortal presence={context.presence} container={props.container}>
            {props.children}
        </OverlayPortal>
    );
}
