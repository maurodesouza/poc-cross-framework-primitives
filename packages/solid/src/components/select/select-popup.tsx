import { useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { SelectContext } from "./select-context.ts";

/** The floating container of the list (no role of its own; spec/select.md). */
export function SelectPopup(
    props: PartProps<{ open: boolean; side: string; align: string }>,
) {
    const context = useContext(SelectContext);
    const state = () => ({ open: context.open(), ...context.placed() });
    return renderPart(
        "div",
        props,
        state,
        () => {
            const status = context.presence.status();
            return {
                "data-select-part": "popup",
                ...stateAttributes({
                    ...state(),
                    "starting-style": status === "starting",
                    "ending-style": status === "ending",
                }),
            };
        },
        { ref: context.setPopup },
    );
}
