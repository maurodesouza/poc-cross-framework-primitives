import type { ReactNode } from "react";
import { Combobox } from "../../kit/ui/combobox.tsx";

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
        <Combobox.Chips>
            <Combobox.Value>
                {(values: Item[]) => (
                    <>
                        {values.map((item) => (
                            <Combobox.Chip key={item.value}>
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
