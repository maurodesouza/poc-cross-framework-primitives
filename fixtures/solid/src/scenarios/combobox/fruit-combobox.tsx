import type { ChangeDetails } from "@poc/solid";
import { createUniqueId } from "solid-js";
import { Combobox } from "../../kit/ui/combobox.tsx";
import { FRUITS, type Fruit } from "./fruits.ts";

export interface FruitComboboxProps {
    value: Fruit | null;
    onValueChange: (value: Fruit | null) => void;
    inputValue: string;
    onInputValueChange: (value: string) => void;
    open: boolean;
    onOpenChange: (open: boolean, details: ChangeDetails) => void;
}

/** The combobox of `/combobox/basic` (spec/combobox.md). */
export function FruitCombobox(props: FruitComboboxProps) {
    const id = createUniqueId();
    return (
        <Combobox.Root
            items={FRUITS}
            value={props.value}
            onValueChange={props.onValueChange}
            inputValue={props.inputValue}
            onInputValueChange={props.onInputValueChange}
            open={props.open}
            onOpenChange={props.onOpenChange}
        >
            <div class="flex flex-col gap-1">
                <label for={id} class="text-sm font-medium">
                    Fruit
                </label>
                <Combobox.InputGroup>
                    <Combobox.Input id={id} />
                    <Combobox.Clear aria-label="Clear fruit">×</Combobox.Clear>
                    <Combobox.Trigger aria-label="Show fruits">
                        ▾
                    </Combobox.Trigger>
                </Combobox.InputGroup>
            </div>
            <FruitPopup />
        </Combobox.Root>
    );
}

/** The fruits' popup: an Empty and the List, each Item with its label (and indicator). */
export function FruitPopup(props: { indicator?: boolean }) {
    return (
        <Combobox.Portal>
            <Combobox.Positioner sideOffset={4}>
                <Combobox.Popup>
                    <Combobox.Empty>No fruit found.</Combobox.Empty>
                    <Combobox.List>
                        {(fruit: Fruit) => (
                            <Combobox.Item
                                value={fruit}
                                disabled={fruit.disabled}
                            >
                                {fruit.label}
                                {props.indicator ? (
                                    <Combobox.ItemIndicator>
                                        ✓
                                    </Combobox.ItemIndicator>
                                ) : null}
                            </Combobox.Item>
                        )}
                    </Combobox.List>
                </Combobox.Popup>
            </Combobox.Positioner>
        </Combobox.Portal>
    );
}
