import { Dialog } from "@base-ui/react/dialog";
import { useState } from "react";
import { Output } from "../../kit/output.tsx";

export function DialogControlled() {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState<string>();
    return (
        <>
            <button type="button" onClick={() => setOpen(true)}>
                Open dialog
            </button>
            <Dialog.Root
                open={open}
                onOpenChange={(next, details) => {
                    setOpen(next);
                    setReason(details.reason);
                }}
            >
                <Dialog.Portal>
                    <Dialog.Backdrop className="backdrop" />
                    <Dialog.Popup className="dialog">
                        <Dialog.Title>Controlled</Dialog.Title>
                        <Dialog.Close>Close</Dialog.Close>
                    </Dialog.Popup>
                </Dialog.Portal>
            </Dialog.Root>
            <Output values={{ open, reason }} />
        </>
    );
}
