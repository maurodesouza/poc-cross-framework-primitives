import { Dialog } from "@base-ui/react/dialog";
import { useState } from "react";
import { Output } from "../../kit/output.tsx";

/** The consumer keeps `open` true: Escape, an outside press and Close change nothing. */
export function DialogRejectedClose() {
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
                    setReason(details.reason);
                    if (next) {
                        setOpen(true);
                    }
                }}
            >
                <Dialog.Portal>
                    <Dialog.Backdrop className="backdrop" />
                    <Dialog.Popup className="dialog">
                        <Dialog.Title>Locked</Dialog.Title>
                        <Dialog.Close>Close</Dialog.Close>
                    </Dialog.Popup>
                </Dialog.Portal>
            </Dialog.Root>
            <Output values={{ open, reason }} />
        </>
    );
}
