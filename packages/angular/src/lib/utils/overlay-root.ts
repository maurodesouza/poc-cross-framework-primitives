import { type InputSignal, type ModelSignal, signal } from "@angular/core";
import { createId } from "@poc/dom";
import type {
    ChangeDetails,
    ChangeReason,
    OpenChangeEvent,
} from "./change-details.ts";
import { controllable } from "./controllable.ts";
import { injectFlush } from "./flush.ts";
import { createPresence } from "./presence.ts";

/**
 * The state every overlay root shares: open (bound or its own) with its last reason, the trigger,
 * positioner and popup elements, ids, and the presence of the popup (mounted while its exit
 * animation runs). Created in a root directive's injection context. `setOpen` is called from
 * event handlers only, and renders the change at once (`injectFlush`).
 */
export function createOverlayRoot(
    inputs: {
        open: ModelSignal<boolean | undefined>;
        defaultOpen: InputSignal<boolean>;
    },
    emit: (event: OpenChangeEvent) => void,
    prefix: string,
) {
    const state = controllable<boolean, ChangeDetails>(
        inputs.open,
        () => inputs.defaultOpen(),
        (open, details) => emit({ open, details }),
    );
    const trigger = signal<HTMLElement | null>(null);
    const positioner = signal<HTMLElement | null>(null);
    const popup = signal<HTMLElement | null>(null);
    const lastReason: { current: ChangeReason | null } = { current: null };
    const id = createId(prefix);
    const flush = injectFlush();
    return {
        open: state.value,
        setOpen: (next: boolean, reason: ChangeReason) => {
            lastReason.current = reason;
            state.set(next, { reason });
            // the popup (and its focus) or the focus return, before the next event
            flush();
        },
        lastReason,
        trigger,
        positioner,
        popup,
        presence: createPresence(state.value, popup),
        triggerId: `${id}-trigger`,
        popupId: `${id}-popup`,
    };
}

export type OverlayRoot = ReturnType<typeof createOverlayRoot>;
