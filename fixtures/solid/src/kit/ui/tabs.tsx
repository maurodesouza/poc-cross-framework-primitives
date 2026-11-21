import { Tabs as Primitive } from "@poc/solid";
import { tabs } from "@poc/styles";
import type { ComponentProps } from "solid-js";

export const Tabs = {
    Root: (props: ComponentProps<typeof Primitive.Root>) => (
        <Primitive.Root class={tabs.root} {...props} />
    ),
    List: (props: ComponentProps<typeof Primitive.List>) => (
        <Primitive.List class={tabs.list} {...props} />
    ),
    Tab: (props: ComponentProps<typeof Primitive.Tab>) => (
        <Primitive.Tab class={tabs.tab} {...props} />
    ),
    Indicator: (props: ComponentProps<typeof Primitive.Indicator>) => (
        <Primitive.Indicator class={tabs.indicator} {...props} />
    ),
    Panel: (props: ComponentProps<typeof Primitive.Panel>) => (
        <Primitive.Panel class={tabs.panel} {...props} />
    ),
};
