import { Popover } from "@base-ui/react/popover";

export function PopoverArrow() {
    return (
        <Popover.Root>
            <Popover.Trigger>With arrow</Popover.Trigger>
            <Popover.Portal>
                <Popover.Positioner sideOffset={10}>
                    <Popover.Popup className="popup">
                        <Popover.Arrow className="arrow" data-testid="arrow" />
                        <Popover.Title>Arrow</Popover.Title>
                    </Popover.Popup>
                </Popover.Positioner>
            </Popover.Portal>
        </Popover.Root>
    );
}
