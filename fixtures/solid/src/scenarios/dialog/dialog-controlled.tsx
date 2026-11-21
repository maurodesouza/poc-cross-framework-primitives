import type { ChangeDetails } from "@poc/solid";
import { createSignal } from "solid-js";
import { Output } from "../../kit/output.tsx";
import { Dialog } from "../../kit/ui/dialog.tsx";

export function DialogControlled() {
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
                    setOpen(next);
                    setReason(details.reason);
                }}
            >
                <Dialog.Portal>
                    <Dialog.Backdrop />
                    <Dialog.Popup>
                        <Dialog.Title>Controlled</Dialog.Title>
                        <Dialog.Close>Close</Dialog.Close>
                    </Dialog.Popup>
                </Dialog.Portal>
            </Dialog.Root>
            <Output values={{ open: open(), reason: reason() }} />
        </>
    );
}
