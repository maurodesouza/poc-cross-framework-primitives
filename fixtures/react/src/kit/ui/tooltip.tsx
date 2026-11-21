import { Tooltip as Primitive } from "@poc/react";
import { tooltip } from "@poc/styles";
import type { ComponentProps } from "react";

export const Tooltip = {
    Provider: Primitive.Provider,
    Root: Primitive.Root,
    Portal: Primitive.Portal,
    Trigger: (props: ComponentProps<typeof Primitive.Trigger>) => (
        <Primitive.Trigger className={tooltip.trigger} {...props} />
    ),
    Positioner: (props: ComponentProps<typeof Primitive.Positioner>) => (
        <Primitive.Positioner className={tooltip.positioner} {...props} />
    ),
    Popup: (props: ComponentProps<typeof Primitive.Popup>) => (
        <Primitive.Popup className={tooltip.popup} {...props} />
    ),
    Arrow: (props: ComponentProps<typeof Primitive.Arrow>) => (
        <Primitive.Arrow className={tooltip.arrow} {...props} />
    ),
};
