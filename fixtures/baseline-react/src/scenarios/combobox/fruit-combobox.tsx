import { Combobox } from "@base-ui/react/combobox";
import { useId } from "react";
import { FRUITS, type Fruit, filterFruits, fruitLabel } from "./fruits.ts";

export interface FruitComboboxProps {
    value: string | null;
    onValueChange: (value: string | null, reason: string) => void;
    inputValue: string;
    onInputValueChange: (value: string, reason: string) => void;
    open: boolean;
    onOpenChange: (open: boolean, reason: string) => void;
}

export function FruitCombobox(props: FruitComboboxProps) {
    const id = useId();
    const filtered = filterFruits(props.inputValue);
    return (
        <Combobox.Root<string>
            items={FRUITS.map((fruit) => fruit.value)}
            filteredItems={filtered.map((fruit) => fruit.value)}
            itemToStringLabel={fruitLabel}
            value={props.value}
            onValueChange={(value, details) =>
                props.onValueChange(value, details.reason)
            }
            inputValue={props.inputValue}
            onInputValueChange={(value, details) =>
                props.onInputValueChange(value, details.reason)
            }
            openOnInputClick={false}
            open={props.open}
            onOpenChange={(open, details) =>
                props.onOpenChange(open, details.reason)
            }
        >
            <label htmlFor={id}>Fruit</label>
            <Combobox.Input id={id} />
            <Combobox.Trigger aria-label="Show fruits">▾</Combobox.Trigger>
            <Combobox.Portal>
                <Combobox.Positioner sideOffset={4}>
                    <Combobox.Popup className="popup">
                        <Combobox.Empty>No fruit found.</Combobox.Empty>
                        <Combobox.List>
                            {(value: string) => {
                                const fruit = FRUITS.find(
                                    (candidate) => candidate.value === value,
                                ) as Fruit;
                                return (
                                    <Combobox.Item
                                        key={value}
                                        value={value}
                                        disabled={fruit.disabled}
                                        className="item"
                                    >
                                        {fruit.label}
                                    </Combobox.Item>
                                );
                            }}
                        </Combobox.List>
                    </Combobox.Popup>
                </Combobox.Positioner>
            </Combobox.Portal>
        </Combobox.Root>
    );
}
