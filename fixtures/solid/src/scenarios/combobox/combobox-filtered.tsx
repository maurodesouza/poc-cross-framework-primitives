import { createSignal, createUniqueId, For } from "solid-js";
import { Output } from "../../kit/output.tsx";
import { Combobox } from "../../kit/ui/combobox.tsx";
import { CITIES } from "./combobox-items.ts";
import { FRUITS } from "./fruits.ts";

const FRUIT_LABELS = FRUITS.map((fruit) => fruit.label);

/** The default filter with a limit, and a list the consumer filters (spec/combobox.md). */
export function ComboboxFiltered() {
    const cityId = createUniqueId();
    const fruitId = createUniqueId();
    const [city, setCity] = createSignal<string | null>(null);
    const [fruit, setFruit] = createSignal<string | null>(null);
    const [query, setQuery] = createSignal("");
    const filtered = () => {
        const needle = query().trim().toLowerCase();
        return FRUIT_LABELS.filter((label) =>
            label.toLowerCase().startsWith(needle),
        );
    };
    return (
        <>
            <div class="flex flex-col gap-4">
                <Combobox.Root
                    items={CITIES}
                    limit={4}
                    value={city()}
                    onValueChange={(next) => setCity(next)}
                >
                    <div class="flex flex-col gap-1">
                        <label for={cityId} class="text-sm font-medium">
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
                                        <Combobox.Item value={entry}>
                                            {entry}
                                        </Combobox.Item>
                                    )}
                                </Combobox.List>
                            </Combobox.Popup>
                        </Combobox.Positioner>
                    </Combobox.Portal>
                </Combobox.Root>
                <Combobox.Root
                    value={fruit()}
                    onValueChange={(next) => setFruit(next)}
                    inputValue={query()}
                    onInputValueChange={(next) => setQuery(next)}
                >
                    <div class="flex flex-col gap-1">
                        <label for={fruitId} class="text-sm font-medium">
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
                                    <For each={filtered()}>
                                        {(entry) => (
                                            <Combobox.Item value={entry}>
                                                {entry}
                                            </Combobox.Item>
                                        )}
                                    </For>
                                </Combobox.List>
                            </Combobox.Popup>
                        </Combobox.Positioner>
                    </Combobox.Portal>
                </Combobox.Root>
            </div>
            <Output values={{ city: city(), fruit: fruit() }} />
        </>
    );
}
