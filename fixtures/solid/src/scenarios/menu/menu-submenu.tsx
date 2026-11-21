import { Output } from "../../kit/output.tsx";
import { Menu } from "../../kit/ui/menu.tsx";
import { createMenuOutput } from "./create-menu-output.ts";

export function MenuSubmenu() {
    const menu = createMenuOutput();
    return (
        <>
            <Menu.Root open={menu.values.open} onOpenChange={menu.onOpenChange}>
                <Menu.Trigger>File</Menu.Trigger>
                <Menu.Portal>
                    <Menu.Positioner sideOffset={4}>
                        <Menu.Popup>
                            <Menu.Item onClick={menu.select("New file")}>
                                New file
                            </Menu.Item>
                            <Menu.SubmenuRoot>
                                <Menu.SubmenuTrigger>Share</Menu.SubmenuTrigger>
                                <Menu.Portal>
                                    <Menu.Positioner>
                                        <Menu.Popup>
                                            <Menu.Item
                                                onClick={menu.select("Email")}
                                            >
                                                Email
                                            </Menu.Item>
                                            <Menu.Item
                                                onClick={menu.select("Link")}
                                            >
                                                Link
                                            </Menu.Item>
                                            <Menu.Item
                                                onClick={menu.select("Slack")}
                                            >
                                                Slack
                                            </Menu.Item>
                                        </Menu.Popup>
                                    </Menu.Positioner>
                                </Menu.Portal>
                            </Menu.SubmenuRoot>
                            <Menu.Item onClick={menu.select("Print")}>
                                Print
                            </Menu.Item>
                        </Menu.Popup>
                    </Menu.Positioner>
                </Menu.Portal>
            </Menu.Root>
            <Output values={menu.values} />
        </>
    );
}
