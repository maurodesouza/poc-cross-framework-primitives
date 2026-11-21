import { Popover } from "../../kit/ui/popover.tsx";

/** A popover whose popup is titled "Placed", placed by its Positioner props. */
export function PlacedPopover(props: {
    label: string;
    side: "top" | "bottom" | "start" | "end";
    align?: "start" | "center" | "end";
}) {
    return (
        <Popover.Root>
            <Popover.Trigger>{props.label}</Popover.Trigger>
            <Popover.Portal>
                <Popover.Positioner
                    side={props.side}
                    align={props.align}
                    sideOffset={4}
                >
                    <Popover.Popup>
                        <Popover.Title>Placed</Popover.Title>
                    </Popover.Popup>
                </Popover.Positioner>
            </Popover.Portal>
        </Popover.Root>
    );
}
