import { Popover } from "../../kit/ui/popover.tsx";

/** A popover whose popup is titled "Placed", placed by its Positioner props. */
export function PlacedPopover({
    label,
    side,
    align,
}: {
    label: string;
    side: "top" | "bottom" | "start" | "end";
    align?: "start" | "center" | "end";
}) {
    return (
        <Popover.Root>
            <Popover.Trigger>{label}</Popover.Trigger>
            <Popover.Portal>
                <Popover.Positioner side={side} align={align} sideOffset={4}>
                    <Popover.Popup>
                        <Popover.Title>Placed</Popover.Title>
                    </Popover.Popup>
                </Popover.Positioner>
            </Popover.Portal>
        </Popover.Root>
    );
}
