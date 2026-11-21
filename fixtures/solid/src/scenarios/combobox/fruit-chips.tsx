import type { JSX } from "@solidjs/web";
import { For } from "solid-js";
import { Combobox } from "../../kit/ui/combobox.tsx";

/**
 * Chips for a `multiple` combobox: a Chip per value, with its ChipRemove, then the Input, then
 * the given buttons.
 */
export function FruitChips<
    Item extends { value: string; label: string },
>(props: { id: string; children?: JSX.Element }) {
    return (
        <Combobox.Chips>
            <Combobox.Value>
                {(values: Item[]) => (
                    <>
                        <For each={values}>
                            {(item) => (
                                <Combobox.Chip>
                                    {item.label}
                                    <Combobox.ChipRemove
                                        aria-label={`Remove ${item.label}`}
                                    >
                                        ×
                                    </Combobox.ChipRemove>
                                </Combobox.Chip>
                            )}
                        </For>
                        <Combobox.Input id={props.id} />
                    </>
                )}
            </Combobox.Value>
            {props.children}
        </Combobox.Chips>
    );
}
