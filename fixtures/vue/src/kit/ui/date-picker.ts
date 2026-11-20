import { datePicker } from "@poc/styles";
import { DatePicker as Primitive } from "@poc/vue";
import { styled } from "../styled.ts";

export const DatePicker = {
    Portal: Primitive.Portal,
    Trigger: styled(Primitive.Trigger, datePicker.trigger),
    Positioner: styled(Primitive.Positioner, datePicker.positioner),
    Popup: styled(Primitive.Popup, datePicker.popup),
};
