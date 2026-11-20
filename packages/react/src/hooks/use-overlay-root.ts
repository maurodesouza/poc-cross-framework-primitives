import { useCallback, useId, useRef, useState } from "react";
import type { ChangeDetails, ChangeReason } from "../utils/change-details.ts";
import { useControllableState } from "./use-controllable-state.ts";
import { usePresence } from "./use-presence.ts";

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
export function useOverlayRoot(props: OverlayRootProps) {
    const [open, setOpenState] = useControllableState(
        props.open,
        props.defaultOpen ?? false,
        props.onOpenChange,
    );
    const [trigger, setTrigger] = useState<HTMLElement | null>(null);
    const [positioner, setPositioner] = useState<HTMLElement | null>(null);
    const [popup, setPopup] = useState<HTMLElement | null>(null);
    const lastReason = useRef<ChangeReason | null>(null);
    const setOpen = useCallback(
        (next: boolean, reason: ChangeReason) => {
            lastReason.current = reason;
            setOpenState(next, { reason });
        },
        [setOpenState],
    );
    const presence = usePresence(open, () => popup);
    const baseId = useId();
    return {
        open,
        setOpen,
        lastReason,
        trigger,
        setTrigger,
        positioner,
        setPositioner,
        popup,
        setPopup,
        presence,
        triggerId: `${baseId}-trigger`,
        popupId: `${baseId}-popup`,
    };
}

export type OverlayRoot = ReturnType<typeof useOverlayRoot>;
