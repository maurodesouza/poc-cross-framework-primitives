import { Slider as Primitive } from "@poc/react";
import { slider } from "@poc/styles";
import type { ComponentProps } from "react";

export const Slider = {
    Root: (props: ComponentProps<typeof Primitive.Root>) => (
        <Primitive.Root className={slider.root} {...props} />
    ),
    Control: (props: ComponentProps<typeof Primitive.Control>) => (
        <Primitive.Control className={slider.control} {...props} />
    ),
    Track: (props: ComponentProps<typeof Primitive.Track>) => (
        <Primitive.Track className={slider.track} {...props} />
    ),
    Indicator: (props: ComponentProps<typeof Primitive.Indicator>) => (
        <Primitive.Indicator className={slider.indicator} {...props} />
    ),
    Thumb: (props: ComponentProps<typeof Primitive.Thumb>) => (
        <Primitive.Thumb className={slider.thumb} {...props} />
    ),
};
