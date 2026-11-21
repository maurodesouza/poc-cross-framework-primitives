import type { ChangeDetails } from "@poc/solid";
import { createSignal } from "solid-js";
import { Output } from "../../kit/output.tsx";
import { Dialog } from "../../kit/ui/dialog.tsx";

/** The consumer keeps `open` true: Escape, an outside press and Close change nothing. */
export function DialogRejectedClose() {
    const [open, setOpen] = createSignal(false);
    const [reason, setReason] = createSignal<string>();
    return (
        <>
            <button type="button" onClick={() => setOpen(true)}>
                Open dialog
            </button>
            <Dialog.Root
                open={open()}
                onOpenChange={(next: boolean, details: ChangeDetails) => {
                    setReason(details.reason);
                    if (next) {
                        setOpen(true);
                    }
                }}
            >
                <Dialog.Portal>
                    <Dialog.Backdrop />
                    <Dialog.Popup>
                        <Dialog.Title>Locked</Dialog.Title>
                        <Dialog.Close>Close</Dialog.Close>
                    </Dialog.Popup>
                </Dialog.Portal>
            </Dialog.Root>
            <Output values={{ open: open(), reason: reason() }} />
        </>
    );
}
