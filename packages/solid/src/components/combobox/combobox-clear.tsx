import { onCleanup, Show, useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { ComboboxContext } from "./combobox-context.ts";

/** Clears the text and the value; rendered only while there is a value (spec/combobox.md). */
export function ComboboxClear(props: PartProps<{ disabled: boolean }>) {
    const context = useContext(ComboboxContext);
    const state = () => ({ disabled: context.disabled() });
    return (
        <Show when={context.values().length > 0}>
            {(() => {
                onCleanup(() => context.setClearButton(null));
                return renderPart(
                    "button",
                    props,
                    state,
                    () => ({
                        type: "button",
                        tabindex: -1,
                        disabled: context.disabled(),
                        "data-combobox-part": "clear",
                        ...stateAttributes(state()),
                        onPointerDown: (event: PointerEvent) =>
                            event.preventDefault(),
                        onClick: () => {
                            context.clear("clear-press");
                            context.trigger()?.focus();
                        },
                    }),
                    { ref: context.setClearButton },
                );
            })()}
        </Show>
    );
}
