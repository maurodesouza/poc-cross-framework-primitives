import { combobox } from "@poc/styles";
import { Combobox as Primitive } from "@poc/vue";
import { styled } from "../styled.ts";

export const Combobox = {
    Root: Primitive.Root,
    Portal: Primitive.Portal,
    Input: styled(Primitive.Input, combobox.input),
    Trigger: styled(Primitive.Trigger, combobox.trigger),
    Positioner: styled(Primitive.Positioner, combobox.positioner),
    Popup: styled(Primitive.Popup, combobox.popup),
    List: styled(Primitive.List, combobox.list),
    Item: styled(Primitive.Item, combobox.item),
    Empty: styled(Primitive.Empty, combobox.empty),
};
