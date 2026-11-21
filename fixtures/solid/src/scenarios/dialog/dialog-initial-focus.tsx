import { Dialog } from "../../kit/ui/dialog.tsx";

export function DialogInitialFocus() {
    let cancel: HTMLElement | undefined;
    return (
        <Dialog.Root>
            <Dialog.Trigger>Delete file</Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Backdrop />
                <Dialog.Popup initialFocus={() => cancel}>
                    <Dialog.Title>Delete file?</Dialog.Title>
                    <div class="flex justify-end gap-2">
                        <button type="button">Delete</button>
                        <Dialog.Close
                            ref={(element: HTMLElement) => {
                                cancel = element;
                            }}
                        >
                            Cancel
                        </Dialog.Close>
                    </div>
                </Dialog.Popup>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
