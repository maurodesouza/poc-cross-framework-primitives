import type { ChangeDetails } from "@poc/solid";
import { createSignal } from "solid-js";

/** The open state, last reason and last clicked item a menu scenario prints. */
export function createMenuOutput() {
    const [open, setOpen] = createSignal(false);
    const [reason, setReason] = createSignal<string>();
    const [action, setAction] = createSignal<string>();
    return {
        values: {
            get open() {
                return open();
            },
            get reason() {
                return reason();
            },
            get action() {
                return action();
            },
        },
        onOpenChange: (next: boolean, details: ChangeDetails) => {
            setOpen(next);
            setReason(details.reason);
        },
        select: (label: string) => () => setAction(label),
    };
}
