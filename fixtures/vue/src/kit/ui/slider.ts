import { slider } from "@poc/styles";
import { Slider as Primitive } from "@poc/vue";
import { styled } from "../styled.ts";

export const Slider = {
    Root: styled(Primitive.Root, slider.root),
    Control: styled(Primitive.Control, slider.control),
    Track: styled(Primitive.Track, slider.track),
    Indicator: styled(Primitive.Indicator, slider.indicator),
    Thumb: styled(Primitive.Thumb, slider.thumb),
};
