import { PlacedPopover } from "./placed-popover.tsx";

export function PopoverRtl() {
    return (
        <p class="my-4">
            <PlacedPopover label="End" side="end" />
        </p>
    );
}
