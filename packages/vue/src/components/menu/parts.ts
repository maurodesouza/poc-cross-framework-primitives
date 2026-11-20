import { MenuGroup } from "./menu-group.ts";
import { MenuGroupLabel } from "./menu-group-label.ts";
import { MenuItem } from "./menu-item.ts";
import { MenuPopup } from "./menu-popup.ts";
import { MenuPortal } from "./menu-portal.ts";
import { MenuPositioner } from "./menu-positioner.ts";
import { MenuRoot, MenuSubmenuRoot } from "./menu-root.ts";
import { MenuSeparator } from "./menu-separator.ts";
import { MenuSubmenuTrigger } from "./menu-submenu-trigger.ts";
import { MenuTrigger } from "./menu-trigger.ts";

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
