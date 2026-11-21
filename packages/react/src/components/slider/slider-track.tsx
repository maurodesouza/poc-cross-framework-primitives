import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import {
    SliderContext,
    type SliderState,
    sliderState,
} from "./slider-context.ts";

/** The rail (spec/slider.md). */
export function SliderTrack(props: PartProps<SliderState>) {
    const context = useRequiredContext(SliderContext, "Slider.Track");
    const state = sliderState(context);
    return renderElement("div", props, state, {
        "data-slider-part": "track",
        ...stateAttributes({
            orientation: state.orientation,
            disabled: state.disabled,
            dragging: state.dragging,
        }),
    });
}
