import { Show, useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import {
    CheckboxContext,
    type CheckboxState,
    checkedAttributes,
} from "./checkbox-context.ts";

export interface CheckboxIndicatorProps extends PartProps<CheckboxState> {
    /** Rendered in every state, not only while checked or indeterminate. */
    keepMounted?: boolean;
}

/** The check or the dash, hidden from assistive technologies (spec/checkbox.md). */
export function CheckboxIndicator(props: CheckboxIndicatorProps) {
    const state = useContext(CheckboxContext);
    return (
        <Show
            when={props.keepMounted || state().checked || state().indeterminate}
        >
            {renderPart(
                "span",
                props,
                state,
                () => ({
                    "aria-hidden": "true",
                    "data-checkbox-part": "indicator",
                    ...stateAttributes(checkedAttributes(state())),
                }),
                { omit: ["keepMounted"] },
            )}
        </Show>
    );
}
