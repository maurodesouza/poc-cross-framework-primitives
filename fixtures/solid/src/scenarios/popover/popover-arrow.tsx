import { Popover } from "../../kit/ui/popover.tsx";

export function PopoverArrow() {
    return (
        <Popover.Root>
            <Popover.Trigger>With arrow</Popover.Trigger>
            <Popover.Portal>
                <Popover.Positioner sideOffset={10}>
                    <Popover.Popup>
                        <Popover.Arrow data-testid="arrow" />
                        <Popover.Title>Arrow</Popover.Title>
                    </Popover.Popup>
                </Popover.Positioner>
            </Popover.Portal>
        </Popover.Root>
    );
}
