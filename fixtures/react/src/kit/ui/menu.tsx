import { Menu as Primitive } from "@poc/react";
import { menu } from "@poc/styles";
import type { ComponentProps } from "react";

export const Menu = {
    Root: Primitive.Root,
    SubmenuRoot: Primitive.SubmenuRoot,
    Portal: Primitive.Portal,
    Trigger: (props: ComponentProps<typeof Primitive.Trigger>) => (
        <Primitive.Trigger className={menu.trigger} {...props} />
    ),
    Positioner: (props: ComponentProps<typeof Primitive.Positioner>) => (
        <Primitive.Positioner className={menu.positioner} {...props} />
    ),
    Popup: (props: ComponentProps<typeof Primitive.Popup>) => (
        <Primitive.Popup className={menu.popup} {...props} />
    ),
    Item: (props: ComponentProps<typeof Primitive.Item>) => (
        <Primitive.Item className={menu.item} {...props} />
    ),
    Separator: (props: ComponentProps<typeof Primitive.Separator>) => (
        <Primitive.Separator className={menu.separator} {...props} />
    ),
    Group: (props: ComponentProps<typeof Primitive.Group>) => (
        <Primitive.Group className={menu.group} {...props} />
    ),
    GroupLabel: (props: ComponentProps<typeof Primitive.GroupLabel>) => (
        <Primitive.GroupLabel className={menu["group-label"]} {...props} />
    ),
    SubmenuTrigger: (
        props: ComponentProps<typeof Primitive.SubmenuTrigger>,
    ) => (
        <Primitive.SubmenuTrigger
            className={menu["submenu-trigger"]}
            {...props}
        />
    ),
};
