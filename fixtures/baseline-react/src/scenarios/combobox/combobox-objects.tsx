import { Combobox } from "@base-ui/react/combobox";
import { useId, useState } from "react";
import { Output } from "../../kit/output.tsx";
import { COUNTRIES, type Country, matchCountry } from "./combobox-items.ts";

/** Object values, compared, named and serialized by the consumer (spec/combobox.md). */
export function ComboboxObjects() {
    const id = useId();
    const [value, setValue] = useState<Country | null>({
        code: "BR",
        name: "Brazil",
    });
    const [input, setInput] = useState("Brazil");
    return (
        <>
            <Combobox.Root<Country>
                items={COUNTRIES}
                itemToStringLabel={(country) => country.name}
                itemToStringValue={(country) => country.code}
                isItemEqualToValue={(item, selected) =>
                    item.code === selected.code
                }
                filter={(item, query) => matchCountry(item, query)}
                value={value}
                onValueChange={setValue}
                inputValue={input}
                onInputValueChange={setInput}
            >
                <label htmlFor={id}>Country</label>
                <Combobox.InputGroup className="field">
                    <Combobox.Input id={id} />
                </Combobox.InputGroup>
                <Combobox.Portal>
                    <Combobox.Positioner sideOffset={4}>
                        <Combobox.Popup className="popup">
                            <Combobox.Empty>No country found.</Combobox.Empty>
                            <Combobox.List>
                                {(country: Country) => (
                                    <Combobox.Item
                                        key={country.code}
                                        value={country}
                                        className="item"
                                    >
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
            <Output values={{ value: value?.code, input }} />
        </>
    );
}
