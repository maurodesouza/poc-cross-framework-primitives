import { useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import {
    SliderContext,
    type SliderState,
    sliderState,
} from "./slider-context.ts";

/** The rail (spec/slider.md). */
export function SliderTrack(props: PartProps<SliderState>) {
    const context = useContext(SliderContext);
    const state = () => sliderState(context);
    return renderPart("div", props, state, () => ({
        "data-slider-part": "track",
        ...stateAttributes({ ...state() }),
    }));
}
