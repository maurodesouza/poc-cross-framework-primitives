import { createSignal, createUniqueId } from "solid-js";
import type { ChangeDetails, ChangeReason } from "../utils/change-details.ts";
import { createControllable } from "./create-controllable.ts";
import { createPresence } from "./create-presence.ts";

export interface OverlayRootProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean, details: ChangeDetails) => void;
}

/**
 * The state every overlay root shares: open (controlled or not) with its last reason, the
 * trigger, positioner and popup elements, ids, and the presence of the popup (mounted while its
 * exit animation runs).
 */
export function createOverlayRoot(props: OverlayRootProps) {
    const [open, setOpenState] = createControllable<boolean, ChangeDetails>(
        () => props.open,
        () => props.defaultOpen ?? false,
        (next, details) => props.onOpenChange?.(next, details),
    );
    const [trigger, setTrigger] = createSignal<HTMLElement | null>(null);
    const [positioner, setPositioner] = createSignal<HTMLElement | null>(null);
    const [popup, setPopup] = createSignal<HTMLElement | null>(null);
    const lastReason: { current: ChangeReason | null } = { current: null };
    const setOpen = (next: boolean, reason: ChangeReason) => {
        lastReason.current = reason;
        setOpenState(next, { reason });
    };
    const presence = createPresence(open, popup);
    const baseId = createUniqueId();
    return {
        open,
        setOpen,
        lastReason,
        trigger,
        setTrigger: (element: HTMLElement | null) => setTrigger(element),
        positioner,
        setPositioner: (element: HTMLElement | null) => setPositioner(element),
        popup,
        setPopup: (element: HTMLElement | null) => setPopup(element),
        presence,
        triggerId: `${baseId}-trigger`,
        popupId: `${baseId}-popup`,
    };
}

export type OverlayRoot = ReturnType<typeof createOverlayRoot>;
