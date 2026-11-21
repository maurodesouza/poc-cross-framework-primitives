import { Tooltip } from "@base-ui/react/tooltip";

const TOOLS = [
    { label: "Bold", hint: "Bold (Ctrl+B)" },
    { label: "Italic", hint: "Italic (Ctrl+I)" },
    { label: "Underline", hint: "Underline (Ctrl+U)" },
];

export function TooltipGroup() {
    return (
        <Tooltip.Provider delay={800} timeout={400}>
            <div className="toolbar">
                {TOOLS.map((tool) => (
                    <Tooltip.Root key={tool.label}>
                        <Tooltip.Trigger>{tool.label}</Tooltip.Trigger>
                        <Tooltip.Portal>
                            <Tooltip.Positioner sideOffset={6}>
                                <Tooltip.Popup
                                    className="tooltip"
                                    role="tooltip"
                                >
                                    {tool.hint}
                                </Tooltip.Popup>
                            </Tooltip.Positioner>
                        </Tooltip.Portal>
                    </Tooltip.Root>
                ))}
            </div>
            <div className="far">
                <button type="button">Elsewhere</button>
            </div>
        </Tooltip.Provider>
    );
}
