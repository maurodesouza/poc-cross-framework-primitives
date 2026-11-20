import { useRef } from "react";
import { Dialog } from "../../kit/ui/dialog.tsx";

export function DialogInitialFocus() {
    const cancel = useRef<HTMLButtonElement>(null);
    return (
        <Dialog.Root>
            <Dialog.Trigger>Delete file</Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Backdrop />
                <Dialog.Popup initialFocus={cancel}>
                    <Dialog.Title>Delete file?</Dialog.Title>
                    <div className="flex justify-end gap-2">
                        <button type="button">Delete</button>
                        <Dialog.Close ref={cancel}>Cancel</Dialog.Close>
                    </div>
                </Dialog.Popup>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
