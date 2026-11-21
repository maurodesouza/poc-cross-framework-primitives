import { createUniqueId } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { ComboboxGroupContext } from "./combobox-context.ts";

/** A `group` of items, named by its GroupLabel (spec/combobox.md). */
export function ComboboxGroup(props: PartProps<Record<string, never>>) {
    const labelId = `${createUniqueId()}-label`;
    return (
        <ComboboxGroupContext value={{ labelId }}>
            {renderPart(
                "div",
                props,
                () => ({}),
                () => ({
                    role: "group",
                    "aria-labelledby": labelId,
                    "data-combobox-part": "group",
                }),
            )}
        </ComboboxGroupContext>
    );
}
