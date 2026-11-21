import type { ChangeDetails } from "@poc/solid";
import { createUniqueId, For, Show } from "solid-js";
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
    const id = createUniqueId();
    const filtered = () => filterFruits(props.inputValue);
    return (
        <Combobox.Root
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
                <div class="flex items-center gap-1">
                    <Combobox.Input id={id} />
                    <Combobox.Trigger aria-label="Show fruits">
                        ▾
                    </Combobox.Trigger>
                </div>
            </div>
            <Combobox.Portal>
                <Combobox.Positioner sideOffset={4}>
                    <Combobox.Popup>
                        <Show when={filtered().length === 0}>
                            <Combobox.Empty>No fruit found.</Combobox.Empty>
                        </Show>
                        <Combobox.List>
                            <For each={filtered()}>
                                {(fruit) => (
                                    <Combobox.Item
                                        value={fruit.value}
                                        disabled={fruit.disabled}
                                    >
                                        {fruit.label}
                                    </Combobox.Item>
                                )}
                            </For>
                        </Combobox.List>
                    </Combobox.Popup>
                </Combobox.Positioner>
            </Combobox.Portal>
        </Combobox.Root>
    );
}
