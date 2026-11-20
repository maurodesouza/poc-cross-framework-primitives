import { Combobox as Primitive } from "@poc/react";
import { combobox } from "@poc/styles";
import type { ComponentProps } from "react";

export const Combobox = {
    Root: Primitive.Root,
    Portal: Primitive.Portal,
    Input: (props: ComponentProps<typeof Primitive.Input>) => (
        <Primitive.Input className={combobox.input} {...props} />
    ),
    Trigger: (props: ComponentProps<typeof Primitive.Trigger>) => (
        <Primitive.Trigger className={combobox.trigger} {...props} />
    ),
    Positioner: (props: ComponentProps<typeof Primitive.Positioner>) => (
        <Primitive.Positioner className={combobox.positioner} {...props} />
    ),
    Popup: (props: ComponentProps<typeof Primitive.Popup>) => (
        <Primitive.Popup className={combobox.popup} {...props} />
    ),
    List: (props: ComponentProps<typeof Primitive.List>) => (
        <Primitive.List className={combobox.list} {...props} />
    ),
    Item: (props: ComponentProps<typeof Primitive.Item>) => (
        <Primitive.Item className={combobox.item} {...props} />
    ),
    Empty: (props: ComponentProps<typeof Primitive.Empty>) => (
        <Primitive.Empty className={combobox.empty} {...props} />
    ),
};
