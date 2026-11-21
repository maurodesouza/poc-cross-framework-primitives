import type { ChangeDetails } from "@poc/solid";
import { For } from "solid-js";
import { Select } from "../../kit/ui/select.tsx";
import { FRUIT_ITEMS } from "./fruit-items.ts";

export interface FruitSelectProps {
    id: string;
    name?: string;
    required?: boolean;
    value?: string | null;
    onValueChange: (value: string | null) => void;
    onOpenChange?: (open: boolean, reason: string) => void;
}

/** The Select of the select scenarios. */
export function FruitSelect(props: FruitSelectProps) {
    return (
        <Select.Root
            items={FRUIT_ITEMS}
            name={props.name}
            required={props.required}
            value={props.value}
            onValueChange={(next: string | null) => props.onValueChange(next)}
            onOpenChange={(open: boolean, details: ChangeDetails) =>
                props.onOpenChange?.(open, details.reason)
            }
        >
            <Select.Trigger id={props.id}>
                <Select.Value placeholder="Choose a fruit" />
            </Select.Trigger>
            <Select.Portal>
                <Select.Positioner>
                    <Select.Popup>
                        <Select.List>
                            <For each={FRUIT_ITEMS}>
                                {(item) => (
                                    <Select.Item value={item.value}>
                                        {item.label}
                                        <Select.ItemIndicator>
                                            ✓
                                        </Select.ItemIndicator>
                                    </Select.Item>
                                )}
                            </For>
                        </Select.List>
                    </Select.Popup>
                </Select.Positioner>
            </Select.Portal>
        </Select.Root>
    );
}
