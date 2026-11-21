import { type JSX, Portal } from "@solidjs/web";
import { Show } from "solid-js";
import type { Presence } from "../../hooks/create-presence.ts";

export interface PortalProps {
    children?: JSX.Element;
    /** Where the content goes (default: `document.body`). */
    container?: Element | null;
}

/** Moves an overlay's content to the end of `body` while it is open or closing. */
export function OverlayPortal(props: PortalProps & { presence: Presence }) {
    return (
        <Show when={props.presence.mounted()}>
            <Portal mount={props.container ?? undefined}>
                {props.children}
            </Portal>
        </Show>
    );
}
