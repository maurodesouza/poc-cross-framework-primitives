import { Combobox } from "@base-ui/react/combobox";
import { useId } from "react";
import { FRUITS, type Fruit } from "./fruits.ts";

export interface FruitComboboxProps {
    value: Fruit | null;
    onValueChange: (value: Fruit | null, reason: string) => void;
    inputValue: string;
    onInputValueChange: (value: string, reason: string) => void;
    open: boolean;
    onOpenChange: (open: boolean, reason: string) => void;
}

/** The combobox of `/combobox/basic` (spec/combobox.md). */
export function FruitCombobox(props: FruitComboboxProps) {
    const id = useId();
    return (
        <Combobox.Root<Fruit>
            items={FRUITS}
            value={props.value}
            onValueChange={(value, details) =>
                props.onValueChange(value, details.reason)
            }
            inputValue={props.inputValue}
            onInputValueChange={(value, details) =>
                props.onInputValueChange(value, details.reason)
            }
            open={props.open}
            onOpenChange={(open, details) =>
                props.onOpenChange(open, details.reason)
            }
        >
            <label htmlFor={id}>Fruit</label>
            <Combobox.InputGroup className="field">
                <Combobox.Input id={id} />
                <Combobox.Clear aria-label="Clear fruit">×</Combobox.Clear>
                <Combobox.Trigger aria-label="Show fruits">▾</Combobox.Trigger>
            </Combobox.InputGroup>
            <FruitPopup />
        </Combobox.Root>
    );
}

/** The fruits' popup: an Empty and the List, each Item with its label (and indicator). */
export function FruitPopup({ indicator = false }: { indicator?: boolean }) {
    return (
        <Combobox.Portal>
            <Combobox.Positioner sideOffset={4}>
                <Combobox.Popup className="popup">
                    <Combobox.Empty>No fruit found.</Combobox.Empty>
                    <Combobox.List>
                        {(fruit: Fruit) => (
                            <Combobox.Item
                                key={fruit.value}
                                value={fruit}
                                disabled={fruit.disabled}
                                className="item"
                            >
                                {fruit.label}
                                {indicator ? (
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
