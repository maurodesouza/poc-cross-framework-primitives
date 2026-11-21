import { DatePicker as Primitive } from "@poc/solid";
import { datePicker } from "@poc/styles";
import type { ComponentProps } from "solid-js";

export const DatePicker = {
    Portal: Primitive.Portal,
    Trigger: (props: ComponentProps<typeof Primitive.Trigger>) => (
        <Primitive.Trigger class={datePicker.trigger} {...props} />
    ),
    Positioner: (props: ComponentProps<typeof Primitive.Positioner>) => (
        <Primitive.Positioner class={datePicker.positioner} {...props} />
    ),
    Popup: (props: ComponentProps<typeof Primitive.Popup>) => (
        <Primitive.Popup class={datePicker.popup} {...props} />
    ),
};
