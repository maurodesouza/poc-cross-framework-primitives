import type { ChangeDetails } from "@poc/react";
import { useId } from "react";
import { Combobox } from "../../kit/ui/combobox.tsx";
import { filterFruits } from "./fruits.ts";

export interface FruitComboboxProps {
    value: string | null;
    onValueChange: (value: string | null) => void;
    inputValue: string;
    onInputValueChange: (value: string) => void;
    open: boolean;
    onOpenChange: (open: boolean, details: ChangeDetails) => void;
}

export function FruitCombobox(props: FruitComboboxProps) {
    const id = useId();
    const filtered = filterFruits(props.inputValue);
    return (
        <Combobox.Root
            value={props.value}
            onValueChange={props.onValueChange}
            inputValue={props.inputValue}
            onInputValueChange={props.onInputValueChange}
            open={props.open}
            onOpenChange={props.onOpenChange}
        >
            <div className="flex flex-col gap-1">
                <label htmlFor={id} className="text-sm font-medium">
                    Fruit
                </label>
                <div className="flex items-center gap-1">
                    <Combobox.Input id={id} />
                    <Combobox.Trigger aria-label="Show fruits">
                        ▾
                    </Combobox.Trigger>
                </div>
            </div>
            <Combobox.Portal>
                <Combobox.Positioner sideOffset={4}>
                    <Combobox.Popup>
                        {filtered.length === 0 ? (
                            <Combobox.Empty>No fruit found.</Combobox.Empty>
                        ) : null}
                        <Combobox.List>
                            {filtered.map((fruit) => (
                                <Combobox.Item
                                    key={fruit.value}
                                    value={fruit.value}
                                    disabled={fruit.disabled}
                                >
                                    {fruit.label}
                                </Combobox.Item>
                            ))}
                        </Combobox.List>
                    </Combobox.Popup>
                </Combobox.Positioner>
            </Combobox.Portal>
        </Combobox.Root>
    );
}
