import { Combobox as Primitive } from "@poc/react";
import { combobox } from "@poc/styles";
import type { ComponentProps } from "react";

export const Combobox = {
    Root: Primitive.Root,
    Portal: Primitive.Portal,
    Value: Primitive.Value,
    InputGroup: (props: ComponentProps<typeof Primitive.InputGroup>) => (
        <Primitive.InputGroup className={combobox["input-group"]} {...props} />
    ),
    Input: (props: ComponentProps<typeof Primitive.Input>) => (
        <Primitive.Input className={combobox.input} {...props} />
    ),
    Trigger: (props: ComponentProps<typeof Primitive.Trigger>) => (
        <Primitive.Trigger className={combobox.trigger} {...props} />
    ),
    Clear: (props: ComponentProps<typeof Primitive.Clear>) => (
        <Primitive.Clear className={combobox.clear} {...props} />
    ),
    Chips: (props: ComponentProps<typeof Primitive.Chips>) => (
        <Primitive.Chips className={combobox.chips} {...props} />
    ),
    Chip: (props: ComponentProps<typeof Primitive.Chip>) => (
        <Primitive.Chip className={combobox.chip} {...props} />
    ),
    ChipRemove: (props: ComponentProps<typeof Primitive.ChipRemove>) => (
        <Primitive.ChipRemove className={combobox["chip-remove"]} {...props} />
    ),
    Status: (props: ComponentProps<typeof Primitive.Status>) => (
        <Primitive.Status className={combobox.status} {...props} />
    ),
    Positioner: (props: ComponentProps<typeof Primitive.Positioner>) => (
        <Primitive.Positioner className={combobox.positioner} {...props} />
    ),
    Popup: (props: ComponentProps<typeof Primitive.Popup>) => (
        <Primitive.Popup className={combobox.popup} {...props} />
    ),
    Empty: (props: ComponentProps<typeof Primitive.Empty>) => (
        <Primitive.Empty className={combobox.empty} {...props} />
    ),
    List: (props: ComponentProps<typeof Primitive.List>) => (
        <Primitive.List className={combobox.list} {...props} />
    ),
    Group: (props: ComponentProps<typeof Primitive.Group>) => (
        <Primitive.Group className={combobox.group} {...props} />
    ),
    GroupLabel: (props: ComponentProps<typeof Primitive.GroupLabel>) => (
        <Primitive.GroupLabel className={combobox["group-label"]} {...props} />
    ),
    Separator: (props: ComponentProps<typeof Primitive.Separator>) => (
        <Primitive.Separator className={combobox.separator} {...props} />
    ),
    Item: (props: ComponentProps<typeof Primitive.Item>) => (
        <Primitive.Item className={combobox.item} {...props} />
    ),
    ItemIndicator: (props: ComponentProps<typeof Primitive.ItemIndicator>) => (
        <Primitive.ItemIndicator
            className={combobox["item-indicator"]}
            {...props}
        />
    ),
};
