import { useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { ComboboxContext } from "./combobox-context.ts";

/** The floating container of the list (no role of its own). */
export function ComboboxPopup(
    props: PartProps<{ open: boolean; side: string; align: string }>,
) {
    const context = useContext(ComboboxContext);
    const state = () => ({ open: context.open(), ...context.placed() });
    return renderPart(
        "div",
        props,
        state,
        () => ({
            "data-combobox-part": "popup",
            ...stateAttributes({
                ...state(),
                "starting-style": context.presence.status() === "starting",
                "ending-style": context.presence.status() === "ending",
            }),
        }),
        { ref: context.setPopup },
    );
}
