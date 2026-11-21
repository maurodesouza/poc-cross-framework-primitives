import { valueToPercent } from "@poc/dom";
import { useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import {
    SliderContext,
    type SliderState,
    sliderState,
} from "./slider-context.ts";

/** The filled part: from `min` to the value, or between the thumbs (spec/slider.md). */
export function SliderIndicator(props: PartProps<SliderState>) {
    const context = useContext(SliderContext);
    const state = () => sliderState(context);
    return renderPart("div", props, state, () => {
        const values = context.values();
        const percents = values.map((entry) =>
            valueToPercent(entry, context.min(), context.max()),
        );
        const start = values.length > 1 ? (percents[0] ?? 0) : 0;
        const end = percents.at(-1) ?? 0;
        const orientation = context.orientation();
        return {
            "data-slider-part": "indicator",
            ...stateAttributes({ orientation }),
            // structural: the filled range
            style:
                orientation === "vertical"
                    ? {
                          position: "absolute",
                          "inset-block-end": `${start}%`,
                          "block-size": `${end - start}%`,
                      }
                    : {
                          position: "absolute",
                          "inset-inline-start": `${start}%`,
                          "inline-size": `${end - start}%`,
                      },
        };
    });
}
