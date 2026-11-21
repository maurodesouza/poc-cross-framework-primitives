import { defineComponent } from "vue";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { SliderKey, sliderState } from "./slider-context.ts";

/** The rail (spec/slider.md). */
export const SliderTrack = defineComponent({
    name: "SliderTrack",
    inheritAttrs: false,
    props: asProp,
    setup(props, { attrs, slots }) {
        const context = useRequiredContext(SliderKey, "Slider.Track");
        return () => {
            const state = sliderState(context);
            return renderPart("div", { attrs, slots }, props.as, state, {
                "data-slider-part": "track",
                ...stateAttributes({
                    orientation: state.orientation,
                    disabled: state.disabled,
                    dragging: state.dragging,
                }),
            });
        };
    },
});
