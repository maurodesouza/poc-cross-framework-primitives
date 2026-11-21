import { Tooltip } from "@base-ui/react/tooltip";
import { useState } from "react";
import { Output } from "../../kit/output.tsx";

export function TooltipBasic() {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState<string>();
    return (
        <>
            <div className="toolbar">
                <button type="button">Before</button>
                <Tooltip.Root
                    open={open}
                    onOpenChange={(next, details) => {
                        setOpen(next);
                        setReason(details.reason);
                    }}
                >
                    <Tooltip.Trigger delay={500}>Save</Tooltip.Trigger>
                    <Tooltip.Portal>
                        <Tooltip.Positioner sideOffset={6}>
                            <Tooltip.Popup className="tooltip" role="tooltip">
                                <Tooltip.Arrow className="arrow" />
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
