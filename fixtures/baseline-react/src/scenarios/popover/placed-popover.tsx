import { Popover } from "@base-ui/react/popover";

type Side = "top" | "bottom" | "inline-start" | "inline-end";

/** A popover whose popup is titled "Placed", placed by its Positioner props. */
export function PlacedPopover({
    label,
    side,
    align,
}: {
    label: string;
    side: Side;
    align?: "start" | "center" | "end";
}) {
    return (
        <Popover.Root>
            <Popover.Trigger>{label}</Popover.Trigger>
            <Popover.Portal>
                <Popover.Positioner side={side} align={align} sideOffset={4}>
                    <Popover.Popup className="popup">
                        <Popover.Title>Placed</Popover.Title>
                    </Popover.Popup>
                </Popover.Positioner>
            </Popover.Portal>
        </Popover.Root>
    );
}
