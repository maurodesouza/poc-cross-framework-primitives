import { For } from "solid-js";
import { Tooltip } from "../../kit/ui/tooltip.tsx";

const TOOLS = [
    { label: "Bold", hint: "Bold (Ctrl+B)" },
    { label: "Italic", hint: "Italic (Ctrl+I)" },
    { label: "Underline", hint: "Underline (Ctrl+U)" },
];

export function TooltipGroup() {
    return (
        <Tooltip.Provider delay={800} timeout={400}>
            <div class="flex gap-2">
                <For each={TOOLS}>
                    {(tool) => (
                        <Tooltip.Root>
                            <Tooltip.Trigger>{tool.label}</Tooltip.Trigger>
                            <Tooltip.Portal>
                                <Tooltip.Positioner sideOffset={6}>
                                    <Tooltip.Popup>{tool.hint}</Tooltip.Popup>
                                </Tooltip.Positioner>
                            </Tooltip.Portal>
                        </Tooltip.Root>
                    )}
                </For>
            </div>
            <div class="mt-30">
                <button type="button">Elsewhere</button>
            </div>
        </Tooltip.Provider>
    );
}
