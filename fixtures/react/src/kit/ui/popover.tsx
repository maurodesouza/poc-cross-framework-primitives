import { Popover as Primitive } from "@poc/react";
import { popover } from "@poc/styles";
import type { ComponentProps } from "react";

export const Popover = {
    Root: Primitive.Root,
    Portal: Primitive.Portal,
    Trigger: (props: ComponentProps<typeof Primitive.Trigger>) => (
        <Primitive.Trigger className={popover.trigger} {...props} />
    ),
    Positioner: (props: ComponentProps<typeof Primitive.Positioner>) => (
        <Primitive.Positioner className={popover.positioner} {...props} />
    ),
    Popup: (props: ComponentProps<typeof Primitive.Popup>) => (
        <Primitive.Popup className={popover.popup} {...props} />
    ),
    Arrow: (props: ComponentProps<typeof Primitive.Arrow>) => (
        <Primitive.Arrow className={popover.arrow} {...props} />
    ),
    Title: (props: ComponentProps<typeof Primitive.Title>) => (
        <Primitive.Title className={popover.title} {...props} />
    ),
    Description: (props: ComponentProps<typeof Primitive.Description>) => (
        <Primitive.Description className={popover.description} {...props} />
    ),
    Close: (props: ComponentProps<typeof Primitive.Close>) => (
        <Primitive.Close className={popover.close} {...props} />
    ),
};
