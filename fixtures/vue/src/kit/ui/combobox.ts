import { combobox } from "@poc/styles";
import { Combobox as Primitive } from "@poc/vue";
import { styled } from "../styled.ts";

export const Combobox = {
    Root: Primitive.Root,
    Portal: Primitive.Portal,
    Value: Primitive.Value,
    InputGroup: styled(Primitive.InputGroup, combobox["input-group"]),
    Input: styled(Primitive.Input, combobox.input),
    Trigger: styled(Primitive.Trigger, combobox.trigger),
    Clear: styled(Primitive.Clear, combobox.clear),
    Chips: styled(Primitive.Chips, combobox.chips),
    Chip: styled(Primitive.Chip, combobox.chip),
    ChipRemove: styled(Primitive.ChipRemove, combobox["chip-remove"]),
    Status: styled(Primitive.Status, combobox.status),
    Positioner: styled(Primitive.Positioner, combobox.positioner),
    Popup: styled(Primitive.Popup, combobox.popup),
    Empty: styled(Primitive.Empty, combobox.empty),
    List: styled(Primitive.List, combobox.list),
    Group: styled(Primitive.Group, combobox.group),
    GroupLabel: styled(Primitive.GroupLabel, combobox["group-label"]),
    Separator: styled(Primitive.Separator, combobox.separator),
    Item: styled(Primitive.Item, combobox.item),
    ItemIndicator: styled(Primitive.ItemIndicator, combobox["item-indicator"]),
};
