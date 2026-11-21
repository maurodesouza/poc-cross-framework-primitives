import { Popover as Primitive } from "@poc/solid";
import { popover } from "@poc/styles";
import type { ComponentProps } from "solid-js";

export const Popover = {
    Root: Primitive.Root,
    Portal: Primitive.Portal,
    Trigger: (props: ComponentProps<typeof Primitive.Trigger>) => (
        <Primitive.Trigger class={popover.trigger} {...props} />
    ),
    Positioner: (props: ComponentProps<typeof Primitive.Positioner>) => (
        <Primitive.Positioner class={popover.positioner} {...props} />
    ),
    Popup: (props: ComponentProps<typeof Primitive.Popup>) => (
        <Primitive.Popup class={popover.popup} {...props} />
    ),
    Arrow: (props: ComponentProps<typeof Primitive.Arrow>) => (
        <Primitive.Arrow class={popover.arrow} {...props} />
    ),
    Title: (props: ComponentProps<typeof Primitive.Title>) => (
        <Primitive.Title class={popover.title} {...props} />
    ),
    Description: (props: ComponentProps<typeof Primitive.Description>) => (
        <Primitive.Description class={popover.description} {...props} />
    ),
    Close: (props: ComponentProps<typeof Primitive.Close>) => (
        <Primitive.Close class={popover.close} {...props} />
    ),
};
