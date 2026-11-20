import type { ChangeDetails } from "@poc/react";
import { useState } from "react";

/** The open state, last reason and last clicked item a menu scenario prints. */
export function useMenuOutput() {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState<string>();
    const [action, setAction] = useState<string>();
    return {
        values: { open, reason, action },
        onOpenChange: (next: boolean, details: ChangeDetails) => {
            setOpen(next);
            setReason(details.reason);
        },
        select: (label: string) => () => setAction(label),
    };
}
