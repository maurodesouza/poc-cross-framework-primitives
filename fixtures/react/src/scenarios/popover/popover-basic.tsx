import type { ChangeDetails } from "@poc/react";
import { useState } from "react";
import { Output } from "../../kit/output.tsx";
import { Popover } from "../../kit/ui/popover.tsx";

export function PopoverBasic() {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState<string>();
    return (
        <>
            <Popover.Root
                open={open}
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
            <button type="button" className="ms-2">
                After trigger
            </button>
            <Output values={{ open, reason }} />
        </>
    );
}
