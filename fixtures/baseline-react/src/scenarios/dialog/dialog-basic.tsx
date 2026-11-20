import { Dialog } from "@base-ui/react/dialog";
import { useState } from "react";
import { Output } from "../../kit/output.tsx";

export function DialogBasic() {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState<string>();
    return (
        <div className="tall">
            <Dialog.Root
                open={open}
                onOpenChange={(next, details) => {
                    setOpen(next);
                    setReason(details.reason);
                }}
            >
                <Dialog.Trigger>Open dialog</Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Backdrop className="backdrop" />
                    <Dialog.Popup className="dialog">
                        <Dialog.Title>Edit profile</Dialog.Title>
                        <Dialog.Description>
                            Change your display name.
                        </Dialog.Description>
                        <label>
                            Name <input type="text" />
                        </label>
                        <Dialog.Close>Save</Dialog.Close>
                        <Dialog.Close>Close</Dialog.Close>
                    </Dialog.Popup>
                </Dialog.Portal>
            </Dialog.Root>
            <button type="button">Outside button</button>
            <Output values={{ open, reason }} />
        </div>
    );
}
