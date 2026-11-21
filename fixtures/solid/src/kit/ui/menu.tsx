import { Menu as Primitive } from "@poc/solid";
import { menu } from "@poc/styles";
import type { ComponentProps } from "solid-js";

export const Menu = {
    Root: Primitive.Root,
    SubmenuRoot: Primitive.SubmenuRoot,
    Portal: Primitive.Portal,
    Trigger: (props: ComponentProps<typeof Primitive.Trigger>) => (
        <Primitive.Trigger class={menu.trigger} {...props} />
    ),
    Positioner: (props: ComponentProps<typeof Primitive.Positioner>) => (
        <Primitive.Positioner class={menu.positioner} {...props} />
    ),
    Popup: (props: ComponentProps<typeof Primitive.Popup>) => (
        <Primitive.Popup class={menu.popup} {...props} />
    ),
    Item: (props: ComponentProps<typeof Primitive.Item>) => (
        <Primitive.Item class={menu.item} {...props} />
    ),
    Separator: (props: ComponentProps<typeof Primitive.Separator>) => (
        <Primitive.Separator class={menu.separator} {...props} />
    ),
    Group: (props: ComponentProps<typeof Primitive.Group>) => (
        <Primitive.Group class={menu.group} {...props} />
    ),
    GroupLabel: (props: ComponentProps<typeof Primitive.GroupLabel>) => (
        <Primitive.GroupLabel class={menu["group-label"]} {...props} />
    ),
    SubmenuTrigger: (
        props: ComponentProps<typeof Primitive.SubmenuTrigger>,
    ) => (
        <Primitive.SubmenuTrigger class={menu["submenu-trigger"]} {...props} />
    ),
};
