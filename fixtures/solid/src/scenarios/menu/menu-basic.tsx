import { Output } from "../../kit/output.tsx";
import { Menu } from "../../kit/ui/menu.tsx";
import { createMenuOutput } from "./create-menu-output.ts";

export function MenuBasic() {
    const menu = createMenuOutput();
    return (
        <>
            <Menu.Root open={menu.values.open} onOpenChange={menu.onOpenChange}>
                <Menu.Trigger>Actions</Menu.Trigger>
                <Menu.Portal>
                    <Menu.Positioner sideOffset={4}>
                        <Menu.Popup>
                            <Menu.Item onClick={menu.select("Edit")}>
                                Edit
                            </Menu.Item>
                            <Menu.Item onClick={menu.select("Duplicate")}>
                                Duplicate
                            </Menu.Item>
                            <Menu.Item
                                disabled
                                onClick={menu.select("Archive")}
                            >
                                Archive
                            </Menu.Item>
                            <Menu.Separator />
                            <Menu.Item onClick={menu.select("Delete")}>
                                Delete
                            </Menu.Item>
                        </Menu.Popup>
                    </Menu.Positioner>
                </Menu.Portal>
            </Menu.Root>
            <button type="button" class="ms-2">
                After menu
            </button>
            <Output values={menu.values} />
        </>
    );
}
