import { menu } from "@poc/styles";
import { Menu as Primitive } from "@poc/vue";
import { styled } from "../styled.ts";

export const Menu = {
    Root: Primitive.Root,
    SubmenuRoot: Primitive.SubmenuRoot,
    Portal: Primitive.Portal,
    Trigger: styled(Primitive.Trigger, menu.trigger),
    Positioner: styled(Primitive.Positioner, menu.positioner),
    Popup: styled(Primitive.Popup, menu.popup),
    Item: styled(Primitive.Item, menu.item),
    Separator: styled(Primitive.Separator, menu.separator),
    Group: styled(Primitive.Group, menu.group),
    GroupLabel: styled(Primitive.GroupLabel, menu["group-label"]),
    SubmenuTrigger: styled(Primitive.SubmenuTrigger, menu["submenu-trigger"]),
};
