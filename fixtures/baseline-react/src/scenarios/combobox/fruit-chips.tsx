import { Combobox } from "@base-ui/react/combobox";
import type { ReactNode } from "react";

/**
 * Chips for a `multiple` combobox: a Chip per value, with its ChipRemove, then the Input, then
 * the given buttons.
 */
export function FruitChips<Item extends { value: string; label: string }>({
    id,
    children,
}: {
    id: string;
    children?: ReactNode;
}) {
    return (
        <Combobox.Chips className="field">
            <Combobox.Value>
                {(values: Item[]) => (
                    <>
                        {values.map((item) => (
                            <Combobox.Chip key={item.value} className="chip">
                                {item.label}
                                <Combobox.ChipRemove
                                    aria-label={`Remove ${item.label}`}
                                >
                                    ×
                                </Combobox.ChipRemove>
                            </Combobox.Chip>
                        ))}
                        <Combobox.Input id={id} />
                    </>
                )}
            </Combobox.Value>
            {children}
        </Combobox.Chips>
    );
}
