import { Combobox as Primitive } from "@poc/solid";
import { combobox } from "@poc/styles";
import type { ComponentProps } from "solid-js";

export const Combobox = {
    Root: Primitive.Root,
    Portal: Primitive.Portal,
    Value: Primitive.Value,
    InputGroup: (props: ComponentProps<typeof Primitive.InputGroup>) => (
        <Primitive.InputGroup class={combobox["input-group"]} {...props} />
    ),
    Input: (props: ComponentProps<typeof Primitive.Input>) => (
        <Primitive.Input class={combobox.input} {...props} />
    ),
    Trigger: (props: ComponentProps<typeof Primitive.Trigger>) => (
        <Primitive.Trigger class={combobox.trigger} {...props} />
    ),
    Clear: (props: ComponentProps<typeof Primitive.Clear>) => (
        <Primitive.Clear class={combobox.clear} {...props} />
    ),
    Chips: (props: ComponentProps<typeof Primitive.Chips>) => (
        <Primitive.Chips class={combobox.chips} {...props} />
    ),
    Chip: (props: ComponentProps<typeof Primitive.Chip>) => (
        <Primitive.Chip class={combobox.chip} {...props} />
    ),
    ChipRemove: (props: ComponentProps<typeof Primitive.ChipRemove>) => (
        <Primitive.ChipRemove class={combobox["chip-remove"]} {...props} />
    ),
    Status: (props: ComponentProps<typeof Primitive.Status>) => (
        <Primitive.Status class={combobox.status} {...props} />
    ),
    Positioner: (props: ComponentProps<typeof Primitive.Positioner>) => (
        <Primitive.Positioner class={combobox.positioner} {...props} />
    ),
    Popup: (props: ComponentProps<typeof Primitive.Popup>) => (
        <Primitive.Popup class={combobox.popup} {...props} />
    ),
    Empty: (props: ComponentProps<typeof Primitive.Empty>) => (
        <Primitive.Empty class={combobox.empty} {...props} />
    ),
    List: (props: ComponentProps<typeof Primitive.List>) => (
        <Primitive.List class={combobox.list} {...props} />
    ),
    Group: (props: ComponentProps<typeof Primitive.Group>) => (
        <Primitive.Group class={combobox.group} {...props} />
    ),
    GroupLabel: (props: ComponentProps<typeof Primitive.GroupLabel>) => (
        <Primitive.GroupLabel class={combobox["group-label"]} {...props} />
    ),
    Separator: (props: ComponentProps<typeof Primitive.Separator>) => (
        <Primitive.Separator class={combobox.separator} {...props} />
    ),
    Item: (props: ComponentProps<typeof Primitive.Item>) => (
        <Primitive.Item class={combobox.item} {...props} />
    ),
    ItemIndicator: (props: ComponentProps<typeof Primitive.ItemIndicator>) => (
        <Primitive.ItemIndicator
            class={combobox["item-indicator"]}
            {...props}
        />
    ),
};
