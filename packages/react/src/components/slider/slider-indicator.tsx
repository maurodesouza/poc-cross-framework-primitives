import { valueToPercent } from "@poc/dom";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import {
    SliderContext,
    type SliderState,
    sliderState,
} from "./slider-context.ts";

/** The filled part: from `min` to the value, or between the thumbs (spec/slider.md). */
export function SliderIndicator(props: PartProps<SliderState>) {
    const context = useRequiredContext(SliderContext, "Slider.Indicator");
    const { values, min, max, orientation } = context;
    const percents = values.map((entry) => valueToPercent(entry, min, max));
    const start = values.length > 1 ? (percents[0] ?? 0) : 0;
    const end = percents.at(-1) ?? 0;
    const style =
        orientation === "vertical"
            ? {
                  position: "absolute" as const,
                  insetBlockEnd: `${start}%`,
                  blockSize: `${end - start}%`,
              }
            : {
                  position: "absolute" as const,
                  insetInlineStart: `${start}%`,
                  inlineSize: `${end - start}%`,
              };
    const state = sliderState(context);
    return renderElement("div", props, state, {
        "data-slider-part": "indicator",
        ...stateAttributes({ orientation }),
        style,
    });
}
