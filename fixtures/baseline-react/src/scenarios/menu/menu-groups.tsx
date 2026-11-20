import { Menu } from "@base-ui/react/menu";

export function MenuGroups() {
    return (
        <Menu.Root>
            <Menu.Trigger>View</Menu.Trigger>
            <Menu.Portal>
                <Menu.Positioner sideOffset={4}>
                    <Menu.Popup className="popup">
                        <Menu.Group>
                            <Menu.GroupLabel>Sort by</Menu.GroupLabel>
                            <Menu.Item className="item">Name</Menu.Item>
                            <Menu.Item className="item">Date</Menu.Item>
                        </Menu.Group>
                        <Menu.Separator />
                        <Menu.Group>
                            <Menu.GroupLabel>Show</Menu.GroupLabel>
                            <Menu.Item className="item">Hidden files</Menu.Item>
                        </Menu.Group>
                    </Menu.Popup>
                </Menu.Positioner>
            </Menu.Portal>
        </Menu.Root>
    );
}
