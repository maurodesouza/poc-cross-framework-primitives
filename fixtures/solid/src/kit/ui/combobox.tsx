import { Combobox as Primitive } from "@poc/solid";
import { combobox } from "@poc/styles";
import type { ComponentProps } from "solid-js";

export const Combobox = {
    Root: Primitive.Root,
    Portal: Primitive.Portal,
    Input: (props: ComponentProps<typeof Primitive.Input>) => (
        <Primitive.Input class={combobox.input} {...props} />
    ),
    Trigger: (props: ComponentProps<typeof Primitive.Trigger>) => (
        <Primitive.Trigger class={combobox.trigger} {...props} />
    ),
    Positioner: (props: ComponentProps<typeof Primitive.Positioner>) => (
        <Primitive.Positioner class={combobox.positioner} {...props} />
    ),
    Popup: (props: ComponentProps<typeof Primitive.Popup>) => (
        <Primitive.Popup class={combobox.popup} {...props} />
    ),
    List: (props: ComponentProps<typeof Primitive.List>) => (
        <Primitive.List class={combobox.list} {...props} />
    ),
    Item: (props: ComponentProps<typeof Primitive.Item>) => (
        <Primitive.Item class={combobox.item} {...props} />
    ),
    Empty: (props: ComponentProps<typeof Primitive.Empty>) => (
        <Primitive.Empty class={combobox.empty} {...props} />
    ),
};
