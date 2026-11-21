import MenuGroup from "./menu-group.svelte";
import MenuGroupLabel from "./menu-group-label.svelte";
import MenuItem from "./menu-item.svelte";
import MenuPopup from "./menu-popup.svelte";
import MenuPortal from "./menu-portal.svelte";
import MenuPositioner from "./menu-positioner.svelte";
import MenuRoot from "./menu-root.svelte";
import MenuSeparator from "./menu-separator.svelte";
import MenuSubmenuRoot from "./menu-submenu-root.svelte";
import MenuSubmenuTrigger from "./menu-submenu-trigger.svelte";
import MenuTrigger from "./menu-trigger.svelte";

/** spec/menu.md */
export const Menu = {
    Root: MenuRoot,
    Trigger: MenuTrigger,
    Portal: MenuPortal,
    Positioner: MenuPositioner,
    Popup: MenuPopup,
    Item: MenuItem,
    Separator: MenuSeparator,
    Group: MenuGroup,
    GroupLabel: MenuGroupLabel,
    SubmenuRoot: MenuSubmenuRoot,
    SubmenuTrigger: MenuSubmenuTrigger,
};
