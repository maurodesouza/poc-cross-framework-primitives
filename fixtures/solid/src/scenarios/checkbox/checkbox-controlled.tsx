import { createSignal } from "solid-js";
import { Output } from "../../kit/output.tsx";
import { Checkbox } from "../../kit/ui/checkbox.tsx";

/** The consumer refuses to clear the checkbox: it stays checked. */
export function CheckboxControlled() {
    const [checked, setChecked] = createSignal(true);
    const [requested, setRequested] = createSignal<boolean>();
    return (
        <>
            <label class="flex items-center gap-2 text-sm">
                <Checkbox.Root
                    checked={checked()}
                    onCheckedChange={(next: boolean) => {
                        setRequested(next);
                        if (next) {
                            setChecked(true);
                        }
                    }}
                />
                Keep me signed in
            </label>
            <Output values={{ checked: checked(), requested: requested() }} />
        </>
    );
}
