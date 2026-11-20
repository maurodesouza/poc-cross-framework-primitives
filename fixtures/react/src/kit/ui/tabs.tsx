import { Tabs as Primitive } from "@poc/react";
import { tabs } from "@poc/styles";
import type { ComponentProps } from "react";

export const Tabs = {
    Root: (props: ComponentProps<typeof Primitive.Root>) => (
        <Primitive.Root className={tabs.root} {...props} />
    ),
    List: (props: ComponentProps<typeof Primitive.List>) => (
        <Primitive.List className={tabs.list} {...props} />
    ),
    Tab: (props: ComponentProps<typeof Primitive.Tab>) => (
        <Primitive.Tab className={tabs.tab} {...props} />
    ),
    Indicator: (props: ComponentProps<typeof Primitive.Indicator>) => (
        <Primitive.Indicator className={tabs.indicator} {...props} />
    ),
    Panel: (props: ComponentProps<typeof Primitive.Panel>) => (
        <Primitive.Panel className={tabs.panel} {...props} />
    ),
};
