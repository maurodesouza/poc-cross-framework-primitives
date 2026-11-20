import { popover } from "@poc/styles";
import { Popover as Primitive } from "@poc/vue";
import { styled } from "../styled.ts";

export const Popover = {
    Root: Primitive.Root,
    Portal: Primitive.Portal,
    Trigger: styled(Primitive.Trigger, popover.trigger),
    Positioner: styled(Primitive.Positioner, popover.positioner),
    Popup: styled(Primitive.Popup, popover.popup),
    Arrow: styled(Primitive.Arrow, popover.arrow),
    Title: styled(Primitive.Title, popover.title),
    Description: styled(Primitive.Description, popover.description),
    Close: styled(Primitive.Close, popover.close),
};
