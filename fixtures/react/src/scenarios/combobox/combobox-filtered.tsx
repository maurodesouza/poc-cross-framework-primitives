import { useId, useState } from "react";
import { Output } from "../../kit/output.tsx";
import { Combobox } from "../../kit/ui/combobox.tsx";
import { CITIES } from "./combobox-items.ts";
import { FRUITS } from "./fruits.ts";

const FRUIT_LABELS = FRUITS.map((fruit) => fruit.label);

/** The default filter with a limit, and a list the consumer filters (spec/combobox.md). */
export function ComboboxFiltered() {
    const cityId = useId();
    const fruitId = useId();
    const [city, setCity] = useState<string | null>(null);
    const [fruit, setFruit] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const needle = query.trim().toLowerCase();
    const filtered = FRUIT_LABELS.filter((label) =>
        label.toLowerCase().startsWith(needle),
    );
    return (
        <>
            <div className="flex flex-col gap-4">
                <Combobox.Root
                    items={CITIES}
                    limit={4}
                    value={city}
                    onValueChange={setCity}
                >
                    <div className="flex flex-col gap-1">
                        <label htmlFor={cityId} className="text-sm font-medium">
                            City
                        </label>
                        <Combobox.InputGroup>
                            <Combobox.Input id={cityId} />
                        </Combobox.InputGroup>
                    </div>
                    <Combobox.Portal>
                        <Combobox.Positioner sideOffset={4}>
                            <Combobox.Popup>
                                <Combobox.Empty>No city found.</Combobox.Empty>
                                <Combobox.List>
                                    {(entry: string) => (
                                        <Combobox.Item
                                            key={entry}
                                            value={entry}
                                        >
                                            {entry}
                                        </Combobox.Item>
                                    )}
                                </Combobox.List>
                            </Combobox.Popup>
                        </Combobox.Positioner>
                    </Combobox.Portal>
                </Combobox.Root>
                <Combobox.Root
                    value={fruit}
                    onValueChange={setFruit}
                    inputValue={query}
                    onInputValueChange={setQuery}
                >
                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor={fruitId}
                            className="text-sm font-medium"
                        >
                            Fruit
                        </label>
                        <Combobox.InputGroup>
                            <Combobox.Input id={fruitId} />
                        </Combobox.InputGroup>
                    </div>
                    <Combobox.Portal>
                        <Combobox.Positioner sideOffset={4}>
                            <Combobox.Popup>
                                <Combobox.Empty>No fruit found.</Combobox.Empty>
                                <Combobox.List>
                                    {filtered.map((entry) => (
                                        <Combobox.Item
                                            key={entry}
                                            value={entry}
                                        >
                                            {entry}
                                        </Combobox.Item>
                                    ))}
                                </Combobox.List>
                            </Combobox.Popup>
                        </Combobox.Positioner>
                    </Combobox.Portal>
                </Combobox.Root>
            </div>
            <Output values={{ city, fruit }} />
        </>
    );
}
