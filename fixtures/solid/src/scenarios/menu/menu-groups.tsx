import { Menu } from "../../kit/ui/menu.tsx";

export function MenuGroups() {
    return (
        <Menu.Root>
            <Menu.Trigger>View</Menu.Trigger>
            <Menu.Portal>
                <Menu.Positioner sideOffset={4}>
                    <Menu.Popup>
                        <Menu.Group>
                            <Menu.GroupLabel>Sort by</Menu.GroupLabel>
                            <Menu.Item>Name</Menu.Item>
                            <Menu.Item>Date</Menu.Item>
                        </Menu.Group>
                        <Menu.Separator />
                        <Menu.Group>
                            <Menu.GroupLabel>Show</Menu.GroupLabel>
                            <Menu.Item>Hidden files</Menu.Item>
                        </Menu.Group>
                    </Menu.Popup>
                </Menu.Positioner>
            </Menu.Portal>
        </Menu.Root>
    );
}
