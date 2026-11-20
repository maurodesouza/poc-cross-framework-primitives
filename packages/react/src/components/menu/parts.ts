import { MenuGroup } from "./menu-group.tsx";
import { MenuGroupLabel } from "./menu-group-label.tsx";
import { MenuItem } from "./menu-item.tsx";
import { MenuPopup } from "./menu-popup.tsx";
import { MenuPortal } from "./menu-portal.tsx";
import { MenuPositioner } from "./menu-positioner.tsx";
import { MenuRoot, MenuSubmenuRoot } from "./menu-root.tsx";
import { MenuSeparator } from "./menu-separator.tsx";
import { MenuSubmenuTrigger } from "./menu-submenu-trigger.tsx";
import { MenuTrigger } from "./menu-trigger.tsx";

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
