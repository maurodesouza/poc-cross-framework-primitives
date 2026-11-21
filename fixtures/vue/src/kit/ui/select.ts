import { select } from "@poc/styles";
import { Select as Primitive } from "@poc/vue";
import { styled } from "../styled.ts";

export const Select = {
    Root: Primitive.Root,
    Portal: Primitive.Portal,
    Trigger: styled(Primitive.Trigger, select.trigger),
    Value: styled(Primitive.Value, select.value),
    Positioner: styled(Primitive.Positioner, select.positioner),
    Popup: styled(Primitive.Popup, select.popup),
    List: styled(Primitive.List, select.list),
    Item: styled(Primitive.Item, select.item),
    ItemIndicator: styled(Primitive.ItemIndicator, select["item-indicator"]),
};
