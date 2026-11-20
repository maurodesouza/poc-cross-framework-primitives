import { Menu } from "@base-ui/react/menu";
import { Output } from "../../kit/output.tsx";
import { useMenuOutput } from "./use-menu-output.ts";

export function MenuSubmenu() {
    const menu = useMenuOutput();
    return (
        <>
            <Menu.Root open={menu.values.open} onOpenChange={menu.onOpenChange}>
                <Menu.Trigger>File</Menu.Trigger>
                <Menu.Portal>
                    <Menu.Positioner sideOffset={4}>
                        <Menu.Popup className="popup">
                            <Menu.Item
                                className="item"
                                onClick={menu.select("New file")}
                            >
                                New file
                            </Menu.Item>
                            <Menu.SubmenuRoot>
                                <Menu.SubmenuTrigger className="item">
                                    Share
                                </Menu.SubmenuTrigger>
                                <Menu.Portal>
                                    <Menu.Positioner>
                                        <Menu.Popup className="popup">
                                            <Menu.Item
                                                className="item"
                                                onClick={menu.select("Email")}
                                            >
                                                Email
                                            </Menu.Item>
                                            <Menu.Item
                                                className="item"
                                                onClick={menu.select("Link")}
                                            >
                                                Link
                                            </Menu.Item>
                                            <Menu.Item
                                                className="item"
                                                onClick={menu.select("Slack")}
                                            >
                                                Slack
                                            </Menu.Item>
                                        </Menu.Popup>
                                    </Menu.Positioner>
                                </Menu.Portal>
                            </Menu.SubmenuRoot>
                            <Menu.Item
                                className="item"
                                onClick={menu.select("Print")}
                            >
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
