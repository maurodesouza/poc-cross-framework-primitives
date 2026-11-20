import { PlacedPopover } from "./placed-popover.tsx";

export function PopoverPlacement() {
    return (
        <>
            <p>
                <PlacedPopover
                    label="Bottom start"
                    side="bottom"
                    align="start"
                />
            </p>
            <p>
                <PlacedPopover label="End" side="inline-end" />
            </p>
            <p className="flip-row">
                <PlacedPopover label="Flip" side="bottom" />
            </p>
        </>
    );
}
