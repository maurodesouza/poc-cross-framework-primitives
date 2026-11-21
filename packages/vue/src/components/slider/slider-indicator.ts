import { valueToPercent } from "@poc/dom";
import { defineComponent } from "vue";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { SliderKey, sliderState } from "./slider-context.ts";

/** The filled part: from `min` to the value, or between the thumbs (spec/slider.md). */
export const SliderIndicator = defineComponent({
    name: "SliderIndicator",
    inheritAttrs: false,
    props: asProp,
    setup(props, { attrs, slots }) {
        const context = useRequiredContext(SliderKey, "Slider.Indicator");
        return () => {
            const values = context.values.value;
            const percents = values.map((entry) =>
                valueToPercent(entry, context.min(), context.max()),
            );
            const start = values.length > 1 ? (percents[0] ?? 0) : 0;
            const end = percents.at(-1) ?? 0;
            const orientation = context.orientation();
            const style =
                orientation === "vertical"
                    ? {
                          position: "absolute",
                          insetBlockEnd: `${start}%`,
                          blockSize: `${end - start}%`,
                      }
                    : {
                          position: "absolute",
                          insetInlineStart: `${start}%`,
                          inlineSize: `${end - start}%`,
                      };
            return renderPart(
                "div",
                { attrs, slots },
                props.as,
                sliderState(context),
                {
                    "data-slider-part": "indicator",
                    ...stateAttributes({ orientation }),
                    style,
                },
            );
        };
    },
});
