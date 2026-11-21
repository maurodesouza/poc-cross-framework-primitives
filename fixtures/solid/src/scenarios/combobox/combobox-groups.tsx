import { createSignal, createUniqueId, For } from "solid-js";
import { Output } from "../../kit/output.tsx";
import { Combobox } from "../../kit/ui/combobox.tsx";
import { PRODUCE, type Produce, type ProduceGroup } from "./combobox-items.ts";
import { printValues } from "./fruits.ts";

/** Grouped items, filtered across the groups (spec/combobox.md). */
export function ComboboxGroups() {
    const id = createUniqueId();
    const [value, setValue] = createSignal<Produce | null>(null);
    return (
        <>
            <Combobox.Root<Produce>
                items={PRODUCE}
                value={value()}
                onValueChange={(next) => setValue(next)}
            >
                <div class="flex flex-col gap-1">
                    <label for={id} class="text-sm font-medium">
                        Produce
                    </label>
                    <Combobox.InputGroup>
                        <Combobox.Input id={id} />
                    </Combobox.InputGroup>
                </div>
                <Combobox.Portal>
                    <Combobox.Positioner sideOffset={4}>
                        <Combobox.Popup>
                            <Combobox.Empty>Nothing found.</Combobox.Empty>
                            <Combobox.List>
                                {(group: ProduceGroup, index: number) => (
                                    <>
                                        {index > 0 ? (
                                            <Combobox.Separator />
                                        ) : null}
                                        <Combobox.Group>
                                            <Combobox.GroupLabel>
                                                {group.label}
                                            </Combobox.GroupLabel>
                                            <For each={group.items}>
                                                {(item) => (
                                                    <Combobox.Item value={item}>
                                                        {item.label}
                                                    </Combobox.Item>
                                                )}
                                            </For>
                                        </Combobox.Group>
                                    </>
                                )}
                            </Combobox.List>
                        </Combobox.Popup>
                    </Combobox.Positioner>
                </Combobox.Portal>
            </Combobox.Root>
            <Output values={{ value: printValues(value()) }} />
        </>
    );
}
