import { OverlayPortal, type PortalProps } from "../shared/overlay-portal.tsx";
import { useMenuContext } from "./menu-context.ts";

export type MenuPortalProps = PortalProps;

export function MenuPortal(props: MenuPortalProps) {
    const context = useMenuContext("Menu.Portal");
    return (
        <OverlayPortal presence={context.presence} container={props.container}>
            {props.children}
        </OverlayPortal>
    );
}
