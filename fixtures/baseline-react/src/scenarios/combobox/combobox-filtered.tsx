import { Combobox } from "@base-ui/react/combobox";
import { useId, useState } from "react";
import { Output } from "../../kit/output.tsx";
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
            <div className="stack">
                <Combobox.Root<string>
                    items={CITIES}
                    limit={4}
                    value={city}
                    onValueChange={setCity}
                >
                    <label htmlFor={cityId}>City</label>
                    <Combobox.InputGroup className="field">
                        <Combobox.Input id={cityId} />
                    </Combobox.InputGroup>
                    <Combobox.Portal>
                        <Combobox.Positioner sideOffset={4}>
                            <Combobox.Popup className="popup">
                                <Combobox.Empty>No city found.</Combobox.Empty>
                                <Combobox.List>
                                    {(entry: string) => (
                                        <Combobox.Item
                                            key={entry}
                                            value={entry}
                                            className="item"
                                        >
                                            {entry}
                                        </Combobox.Item>
                                    )}
                                </Combobox.List>
                            </Combobox.Popup>
                        </Combobox.Positioner>
                    </Combobox.Portal>
                </Combobox.Root>
                <Combobox.Root<string>
                    items={FRUIT_LABELS}
                    filteredItems={filtered}
                    value={fruit}
                    onValueChange={setFruit}
                    inputValue={query}
                    onInputValueChange={setQuery}
                >
                    <label htmlFor={fruitId}>Fruit</label>
                    <Combobox.InputGroup className="field">
                        <Combobox.Input id={fruitId} />
                    </Combobox.InputGroup>
                    <Combobox.Portal>
                        <Combobox.Positioner sideOffset={4}>
                            <Combobox.Popup className="popup">
                                <Combobox.Empty>No fruit found.</Combobox.Empty>
                                <Combobox.List>
                                    {(entry: string) => (
                                        <Combobox.Item
                                            key={entry}
                                            value={entry}
                                            className="item"
                                        >
                                            {entry}
                                        </Combobox.Item>
                                    )}
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
