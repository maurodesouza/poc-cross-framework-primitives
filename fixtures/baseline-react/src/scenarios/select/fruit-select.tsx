import { Select } from "@base-ui/react/select";
import { FRUIT_ITEMS } from "./fruit-items.ts";

export interface FruitSelectProps {
    id: string;
    name?: string;
    required?: boolean;
    value?: string | null;
    onValueChange: (value: string | null) => void;
    onOpenChange?: (open: boolean, reason: string) => void;
}

/** The Select of the select scenarios, on Base UI (`alignItemWithTrigger={false}`). */
export function FruitSelect(props: FruitSelectProps) {
    return (
        <Select.Root
            items={FRUIT_ITEMS}
            name={props.name}
            required={props.required}
            value={props.value}
            onValueChange={(next) => props.onValueChange(next as string | null)}
            onOpenChange={(open, details) =>
                props.onOpenChange?.(open, details.reason)
            }
        >
            <Select.Trigger id={props.id} className="select-trigger">
                <Select.Value placeholder="Choose a fruit" />
            </Select.Trigger>
            <Select.Portal>
                <Select.Positioner sideOffset={4} alignItemWithTrigger={false}>
                    <Select.Popup className="select-popup">
                        <Select.List>
                            {FRUIT_ITEMS.map((item) => (
                                <Select.Item
                                    key={item.value}
                                    value={item.value}
                                    disabled={item.disabled}
                                    className="item"
                                >
                                    <Select.ItemText>
                                        {item.label}
                                    </Select.ItemText>
                                </Select.Item>
                            ))}
                        </Select.List>
                    </Select.Popup>
                </Select.Positioner>
            </Select.Portal>
        </Select.Root>
    );
}
