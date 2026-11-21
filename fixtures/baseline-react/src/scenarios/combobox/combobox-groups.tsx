import { Combobox } from "@base-ui/react/combobox";
import { Fragment, useId, useState } from "react";
import { Output } from "../../kit/output.tsx";
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
                <label htmlFor={id}>Produce</label>
                <Combobox.InputGroup className="field">
                    <Combobox.Input id={id} />
                </Combobox.InputGroup>
                <Combobox.Portal>
                    <Combobox.Positioner sideOffset={4}>
                        <Combobox.Popup className="popup">
                            <Combobox.Empty>Nothing found.</Combobox.Empty>
                            <Combobox.List>
                                {(group: ProduceGroup, index: number) => (
                                    <Fragment key={group.label}>
                                        {index > 0 ? (
                                            <Combobox.Separator />
                                        ) : null}
                                        <Combobox.Group items={group.items}>
                                            <Combobox.GroupLabel>
                                                {group.label}
                                            </Combobox.GroupLabel>
                                            <Combobox.Collection>
                                                {(item: Produce) => (
                                                    <Combobox.Item
                                                        key={item.value}
                                                        value={item}
                                                        className="item"
                                                    >
                                                        {item.label}
                                                    </Combobox.Item>
                                                )}
                                            </Combobox.Collection>
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
