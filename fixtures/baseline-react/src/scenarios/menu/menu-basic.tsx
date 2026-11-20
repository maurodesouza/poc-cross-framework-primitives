import { Menu } from "@base-ui/react/menu";
import { Output } from "../../kit/output.tsx";
import { useMenuOutput } from "./use-menu-output.ts";

export function MenuBasic() {
    const menu = useMenuOutput();
    return (
        <>
            <Menu.Root open={menu.values.open} onOpenChange={menu.onOpenChange}>
                <Menu.Trigger>Actions</Menu.Trigger>
                <Menu.Portal>
                    <Menu.Positioner sideOffset={4}>
                        <Menu.Popup className="popup">
                            <Menu.Item
                                className="item"
                                onClick={menu.select("Edit")}
                            >
                                Edit
                            </Menu.Item>
                            <Menu.Item
                                className="item"
                                onClick={menu.select("Duplicate")}
                            >
                                Duplicate
                            </Menu.Item>
                            <Menu.Item
                                className="item"
                                disabled
                                onClick={menu.select("Archive")}
                            >
                                Archive
                            </Menu.Item>
                            <Menu.Separator />
                            <Menu.Item
                                className="item"
                                onClick={menu.select("Delete")}
                            >
                                Delete
                            </Menu.Item>
                        </Menu.Popup>
                    </Menu.Positioner>
                </Menu.Portal>
            </Menu.Root>
            <button type="button">After menu</button>
            <Output values={menu.values} />
        </>
    );
}
