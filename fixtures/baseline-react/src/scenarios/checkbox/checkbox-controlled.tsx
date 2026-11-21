import { Checkbox } from "@base-ui/react/checkbox";
import { useState } from "react";
import { Output } from "../../kit/output.tsx";

/** The consumer refuses to clear the checkbox: it stays checked. */
export function CheckboxControlled() {
    const [checked, setChecked] = useState(true);
    const [requested, setRequested] = useState<boolean>();
    return (
        <>
            <label className="field">
                <Checkbox.Root
                    className="checkbox"
                    checked={checked}
                    onCheckedChange={(next) => {
                        setRequested(next);
                        if (next) {
                            setChecked(true);
                        }
                    }}
                >
                    <Checkbox.Indicator aria-hidden>✓</Checkbox.Indicator>
                </Checkbox.Root>
                Keep me signed in
            </label>
            <Output values={{ checked, requested }} />
        </>
    );
}
