import { useId } from "react";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { ComboboxGroupContext } from "./combobox-context.ts";

/** A `group` of items, named by its GroupLabel (spec/combobox.md). */
export function ComboboxGroup(props: PartProps<Record<string, never>>) {
    const labelId = `${useId()}-label`;
    return (
        <ComboboxGroupContext.Provider value={{ labelId }}>
            {renderElement(
                "div",
                props,
                {},
                {
                    role: "group",
                    "aria-labelledby": labelId,
                    "data-combobox-part": "group",
                },
            )}
        </ComboboxGroupContext.Provider>
    );
}
