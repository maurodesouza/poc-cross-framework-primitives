import type { Align, Side } from "@poc/dom";
import type { ChangeDetails, ChangeReason } from "./change-details.ts";
import { Controllable } from "./controllable.svelte.ts";
import { Presence } from "./presence.svelte.ts";

let counter = 0;

/**
 * The state every overlay root shares: open (`bind:open`, or its own) with its last reason, the
 * trigger, positioner and popup elements, ids, the popup's presence and where it was placed.
 */
export class OverlayRoot {
    trigger = $state<HTMLElement | null>(null);
    positioner = $state<HTMLElement | null>(null);
    popup = $state<HTMLElement | null>(null);
    placed = $state<{ side: Side; align: Align }>({
        side: "bottom",
        align: "center",
    });
    readonly lastReason: { current: ChangeReason | null } = { current: null };
    readonly presence: Presence;
    readonly triggerId: string;
    readonly popupId: string;
    readonly #open: Controllable<boolean>;
    readonly #onChange: () =>
        | ((open: boolean, details: ChangeDetails) => void)
        | undefined;

    constructor(options: {
        read: () => boolean | undefined;
        write: (open: boolean) => void;
        initial: boolean;
        onOpenChange: () =>
            | ((open: boolean, details: ChangeDetails) => void)
            | undefined;
        placed?: { side: Side; align: Align };
    }) {
        this.#open = new Controllable(
            options.read,
            options.write,
            options.initial,
        );
        this.#onChange = options.onOpenChange;
        if (options.placed) {
            this.placed = options.placed;
        }
        counter += 1;
        this.triggerId = `poc-${counter}-trigger`;
        this.popupId = `poc-${counter}-popup`;
        this.presence = new Presence(
            () => this.open,
            () => this.popup,
        );
    }

    get open(): boolean {
        return this.#open.value;
    }

    setOpen(next: boolean, reason: ChangeReason): void {
        this.lastReason.current = reason;
        if (this.#open.set(next)) {
            this.#onChange()?.(next, { reason });
        }
    }
}
