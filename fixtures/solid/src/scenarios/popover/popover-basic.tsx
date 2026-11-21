import type { ChangeDetails } from "@poc/solid";
import { createSignal } from "solid-js";
import { Output } from "../../kit/output.tsx";
import { Popover } from "../../kit/ui/popover.tsx";

export function PopoverBasic() {
    const [open, setOpen] = createSignal(false);
    const [reason, setReason] = createSignal<string>();
    return (
        <>
            <Popover.Root
                open={open()}
                onOpenChange={(next: boolean, details: ChangeDetails) => {
                    setOpen(next);
                    setReason(details.reason);
                }}
            >
                <Popover.Trigger>Open popover</Popover.Trigger>
                <Popover.Portal>
                    <Popover.Positioner sideOffset={4}>
                        <Popover.Popup>
                            <Popover.Title>Notifications</Popover.Title>
                            <Popover.Description>
                                You have 3 unread messages.
                            </Popover.Description>
                            <button type="button">Mark all as read</button>
                            <Popover.Close>Close</Popover.Close>
                        </Popover.Popup>
                    </Popover.Positioner>
                </Popover.Portal>
            </Popover.Root>
            <button type="button" class="ms-2">
                After trigger
            </button>
            <Output values={{ open: open(), reason: reason() }} />
        </>
    );
}
