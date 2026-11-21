import { Dialog } from "../../kit/ui/dialog.tsx";
import { Popover } from "../../kit/ui/popover.tsx";

export function DialogNestedPopover() {
    return (
        <Dialog.Root>
            <Dialog.Trigger>Open dialog</Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Backdrop />
                <Dialog.Popup>
                    <Dialog.Title>Edit profile</Dialog.Title>
                    <Dialog.Description>
                        Change your display name.
                    </Dialog.Description>
                    <Popover.Root>
                        <Popover.Trigger>More info</Popover.Trigger>
                        <Popover.Portal>
                            <Popover.Positioner sideOffset={4}>
                                <Popover.Popup>
                                    <Popover.Title>About names</Popover.Title>
                                    <Popover.Close>Got it</Popover.Close>
                                </Popover.Popup>
                            </Popover.Positioner>
                        </Popover.Portal>
                    </Popover.Root>
                    <Dialog.Close>Close</Dialog.Close>
                </Dialog.Popup>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
