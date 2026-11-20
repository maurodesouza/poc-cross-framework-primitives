import { PlacedPopover } from "./placed-popover.tsx";

export function PopoverRtl() {
    return (
        <p className="my-4">
            <PlacedPopover label="End" side="end" />
        </p>
    );
}
