import type { ChangeDetails } from "@poc/react";
import { useState } from "react";
import { Output } from "../../kit/output.tsx";
import { Tooltip } from "../../kit/ui/tooltip.tsx";

export function TooltipBasic() {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState<string>();
    return (
        <>
            <div className="flex gap-2">
                <button type="button">Before</button>
                <Tooltip.Root
                    delay={500}
                    open={open}
                    onOpenChange={(next: boolean, details: ChangeDetails) => {
                        setOpen(next);
                        setReason(details.reason);
                    }}
                >
                    <Tooltip.Trigger>Save</Tooltip.Trigger>
                    <Tooltip.Portal>
                        <Tooltip.Positioner sideOffset={6}>
                            <Tooltip.Popup>
                                <Tooltip.Arrow />
                                Save the document
                            </Tooltip.Popup>
                        </Tooltip.Positioner>
                    </Tooltip.Portal>
                </Tooltip.Root>
            </div>
            <Output values={{ open, reason }} />
        </>
    );
}
