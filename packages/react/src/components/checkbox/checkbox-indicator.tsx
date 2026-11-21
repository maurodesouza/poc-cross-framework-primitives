import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
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
export function CheckboxIndicator({
    keepMounted = false,
    ...props
}: CheckboxIndicatorProps) {
    const state = useRequiredContext(CheckboxContext, "Checkbox.Indicator");
    if (!keepMounted && !state.checked && !state.indeterminate) {
        return null;
    }
    return renderElement("span", props, state, {
        "aria-hidden": "true",
        "data-checkbox-part": "indicator",
        ...stateAttributes(checkedAttributes(state)),
    });
}
