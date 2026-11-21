import { PlacedPopover } from "./placed-popover.tsx";

export function PopoverPlacement() {
    return (
        <>
            <p class="my-4">
                <PlacedPopover
                    label="Bottom start"
                    side="bottom"
                    align="start"
                />
            </p>
            <p class="my-4">
                <PlacedPopover label="End" side="end" />
            </p>
            <p class="fixed bottom-2 start-6">
                <PlacedPopover label="Flip" side="bottom" />
            </p>
        </>
    );
}
