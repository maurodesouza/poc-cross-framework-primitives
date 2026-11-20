import { Dialog } from "@base-ui/react/dialog";
import { useRef } from "react";

export function DialogInitialFocus() {
    const cancel = useRef<HTMLButtonElement>(null);
    return (
        <Dialog.Root>
            <Dialog.Trigger>Delete file</Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Backdrop className="backdrop" />
                <Dialog.Popup className="dialog" initialFocus={cancel}>
                    <Dialog.Title>Delete file?</Dialog.Title>
                    <button type="button">Delete</button>
                    <Dialog.Close ref={cancel}>Cancel</Dialog.Close>
                </Dialog.Popup>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
