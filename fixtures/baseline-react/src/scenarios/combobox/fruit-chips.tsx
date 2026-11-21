import { Combobox } from "@base-ui/react/combobox";

/** Chips for a `multiple` combobox: a Chip per value, with its ChipRemove, then the Input. */
export function FruitChips<Item extends { value: string; label: string }>({
    id,
}: {
    id: string;
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
        </Combobox.Chips>
    );
}
