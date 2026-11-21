import { Fragment, useId, useState } from "react";
import { Output } from "../../kit/output.tsx";
import { Combobox } from "../../kit/ui/combobox.tsx";
import { PRODUCE, type Produce, type ProduceGroup } from "./combobox-items.ts";
import { printValues } from "./fruits.ts";

/** Grouped items, filtered across the groups (spec/combobox.md). */
export function ComboboxGroups() {
    const id = useId();
    const [value, setValue] = useState<Produce | null>(null);
    return (
        <>
            <Combobox.Root<Produce>
                items={PRODUCE}
                value={value}
                onValueChange={setValue}
            >
                <div className="flex flex-col gap-1">
                    <label htmlFor={id} className="text-sm font-medium">
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
                                    <Fragment key={group.label}>
                                        {index > 0 ? (
                                            <Combobox.Separator />
                                        ) : null}
                                        <Combobox.Group>
                                            <Combobox.GroupLabel>
                                                {group.label}
                                            </Combobox.GroupLabel>
                                            {group.items.map((item) => (
                                                <Combobox.Item
                                                    key={item.value}
                                                    value={item}
                                                >
                                                    {item.label}
                                                </Combobox.Item>
                                            ))}
                                        </Combobox.Group>
                                    </Fragment>
                                )}
                            </Combobox.List>
                        </Combobox.Popup>
                    </Combobox.Positioner>
                </Combobox.Portal>
            </Combobox.Root>
            <Output values={{ value: printValues(value) }} />
        </>
    );
}
