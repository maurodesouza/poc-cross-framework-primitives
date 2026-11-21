import { Tooltip as Primitive } from "@poc/solid";
import { tooltip } from "@poc/styles";
import type { ComponentProps } from "solid-js";

export const Tooltip = {
    Provider: Primitive.Provider,
    Root: Primitive.Root,
    Portal: Primitive.Portal,
    Trigger: (props: ComponentProps<typeof Primitive.Trigger>) => (
        <Primitive.Trigger class={tooltip.trigger} {...props} />
    ),
    Positioner: (props: ComponentProps<typeof Primitive.Positioner>) => (
        <Primitive.Positioner class={tooltip.positioner} {...props} />
    ),
    Popup: (props: ComponentProps<typeof Primitive.Popup>) => (
        <Primitive.Popup class={tooltip.popup} {...props} />
    ),
    Arrow: (props: ComponentProps<typeof Primitive.Arrow>) => (
        <Primitive.Arrow class={tooltip.arrow} {...props} />
    ),
};
