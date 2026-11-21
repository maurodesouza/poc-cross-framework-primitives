import { Slider as Primitive } from "@poc/solid";
import { slider } from "@poc/styles";
import type { ComponentProps } from "solid-js";

export const Slider = {
    Root: (props: ComponentProps<typeof Primitive.Root>) => (
        <Primitive.Root class={slider.root} {...props} />
    ),
    Control: (props: ComponentProps<typeof Primitive.Control>) => (
        <Primitive.Control class={slider.control} {...props} />
    ),
    Track: (props: ComponentProps<typeof Primitive.Track>) => (
        <Primitive.Track class={slider.track} {...props} />
    ),
    Indicator: (props: ComponentProps<typeof Primitive.Indicator>) => (
        <Primitive.Indicator class={slider.indicator} {...props} />
    ),
    Thumb: (props: ComponentProps<typeof Primitive.Thumb>) => (
        <Primitive.Thumb class={slider.thumb} {...props} />
    ),
};
