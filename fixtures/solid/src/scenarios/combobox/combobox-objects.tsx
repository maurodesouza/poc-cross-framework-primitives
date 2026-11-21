import { createSignal, createUniqueId } from "solid-js";
import { Output } from "../../kit/output.tsx";
import { Combobox } from "../../kit/ui/combobox.tsx";
import { COUNTRIES, type Country, matchCountry } from "./combobox-items.ts";

/** Object values, compared, named and serialized by the consumer (spec/combobox.md). */
export function ComboboxObjects() {
    const id = createUniqueId();
    const [value, setValue] = createSignal<Country | null>({
        code: "BR",
        name: "Brazil",
    });
    const [input, setInput] = createSignal("Brazil");
    return (
        <>
            <Combobox.Root
                items={COUNTRIES}
                itemToStringLabel={(country) => country.name}
                itemToStringValue={(country) => country.code}
                isItemEqualToValue={(item, selected) =>
                    item.code === selected.code
                }
                filter={(item, query) => matchCountry(item, query)}
                value={value()}
                onValueChange={(next) => setValue(next)}
                inputValue={input()}
                onInputValueChange={(next) => setInput(next)}
            >
                <div class="flex flex-col gap-1">
                    <label for={id} class="text-sm font-medium">
                        Country
                    </label>
                    <Combobox.InputGroup>
                        <Combobox.Input id={id} />
                    </Combobox.InputGroup>
                </div>
                <Combobox.Portal>
                    <Combobox.Positioner sideOffset={4}>
                        <Combobox.Popup>
                            <Combobox.Empty>No country found.</Combobox.Empty>
                            <Combobox.List>
                                {(country: Country) => (
                                    <Combobox.Item value={country}>
                                        {country.name}
                                        <Combobox.ItemIndicator>
                                            ✓
                                        </Combobox.ItemIndicator>
                                    </Combobox.Item>
                                )}
                            </Combobox.List>
                        </Combobox.Popup>
                    </Combobox.Positioner>
                </Combobox.Portal>
            </Combobox.Root>
            <Output values={{ value: value()?.code, input: input() }} />
        </>
    );
}
