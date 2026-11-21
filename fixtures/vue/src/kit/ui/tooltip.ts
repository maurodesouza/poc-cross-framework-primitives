import { tooltip } from "@poc/styles";
import { Tooltip as Primitive } from "@poc/vue";
import { styled } from "../styled.ts";

export const Tooltip = {
    Provider: Primitive.Provider,
    Root: Primitive.Root,
    Portal: Primitive.Portal,
    Trigger: styled(Primitive.Trigger, tooltip.trigger),
    Positioner: styled(Primitive.Positioner, tooltip.positioner),
    Popup: styled(Primitive.Popup, tooltip.popup),
    Arrow: styled(Primitive.Arrow, tooltip.arrow),
};
