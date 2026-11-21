import { Select as Primitive } from "@poc/solid";
import { select } from "@poc/styles";
import type { ComponentProps } from "solid-js";

export const Select = {
    Root: Primitive.Root,
    Portal: Primitive.Portal,
    Trigger: (props: ComponentProps<typeof Primitive.Trigger>) => (
        <Primitive.Trigger class={select.trigger} {...props} />
    ),
    Value: (props: ComponentProps<typeof Primitive.Value>) => (
        <Primitive.Value class={select.value} {...props} />
    ),
    Positioner: (props: ComponentProps<typeof Primitive.Positioner>) => (
        <Primitive.Positioner class={select.positioner} {...props} />
    ),
    Popup: (props: ComponentProps<typeof Primitive.Popup>) => (
        <Primitive.Popup class={select.popup} {...props} />
    ),
    List: (props: ComponentProps<typeof Primitive.List>) => (
        <Primitive.List class={select.list} {...props} />
    ),
    Item: (props: ComponentProps<typeof Primitive.Item>) => (
        <Primitive.Item class={select.item} {...props} />
    ),
    ItemIndicator: (props: ComponentProps<typeof Primitive.ItemIndicator>) => (
        <Primitive.ItemIndicator class={select["item-indicator"]} {...props} />
    ),
};
