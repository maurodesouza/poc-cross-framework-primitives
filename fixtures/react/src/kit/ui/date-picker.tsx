import { DatePicker as Primitive } from "@poc/react";
import { datePicker } from "@poc/styles";
import type { ComponentProps } from "react";

export const DatePicker = {
    Portal: Primitive.Portal,
    Trigger: (props: ComponentProps<typeof Primitive.Trigger>) => (
        <Primitive.Trigger className={datePicker.trigger} {...props} />
    ),
    Positioner: (props: ComponentProps<typeof Primitive.Positioner>) => (
        <Primitive.Positioner className={datePicker.positioner} {...props} />
    ),
    Popup: (props: ComponentProps<typeof Primitive.Popup>) => (
        <Primitive.Popup className={datePicker.popup} {...props} />
    ),
};
