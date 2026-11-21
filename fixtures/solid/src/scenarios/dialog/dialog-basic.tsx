import type { ChangeDetails } from "@poc/solid";
import { createSignal } from "solid-js";
import { Output } from "../../kit/output.tsx";
import { Dialog } from "../../kit/ui/dialog.tsx";

export function DialogBasic() {
    const [open, setOpen] = createSignal(false);
    const [reason, setReason] = createSignal<string>();
    return (
        <div class="h-[200vh]">
            <Dialog.Root
                open={open()}
                onOpenChange={(next: boolean, details: ChangeDetails) => {
                    setOpen(next);
                    setReason(details.reason);
                }}
            >
                <Dialog.Trigger>Open dialog</Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Backdrop />
                    <Dialog.Popup>
                        <Dialog.Title>Edit profile</Dialog.Title>
                        <Dialog.Description>
                            Change your display name.
                        </Dialog.Description>
                        <label class="flex flex-col gap-1 text-sm">
                            Name
                            <input
                                type="text"
                                class="h-9 rounded-md border border-palette-line px-2"
                            />
                        </label>
                        <div class="flex justify-end gap-2">
                            <Dialog.Close>Save</Dialog.Close>
                            <Dialog.Close>Close</Dialog.Close>
                        </div>
                    </Dialog.Popup>
                </Dialog.Portal>
            </Dialog.Root>
            <button type="button" class="ms-2">
                Outside button
            </button>
            <Output values={{ open: open(), reason: reason() }} />
        </div>
    );
}
