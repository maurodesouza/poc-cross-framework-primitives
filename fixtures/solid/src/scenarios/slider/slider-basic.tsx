import { createSignal } from "solid-js";
import { formEntries } from "../../kit/form-entries.ts";
import { Output } from "../../kit/output.tsx";
import { Slider } from "../../kit/ui/slider.tsx";

/** Also `/slider/rtl` (the page sets `dir`). */
export function SliderBasic() {
    const [value, setValue] = createSignal<number>();
    const [committed, setCommitted] = createSignal<number>();
    const [form, setForm] = createSignal<string>();
    return (
        <>
            <form
                class="flex flex-col items-start gap-2"
                onSubmit={(event) => {
                    event.preventDefault();
                    setForm(formEntries(event.currentTarget));
                }}
            >
                <Slider.Root
                    defaultValue={50}
                    name="volume"
                    onValueChange={(next: number) => setValue(next)}
                    onValueCommit={(next: number) => setCommitted(next)}
                >
                    <Slider.Control data-testid="control">
                        <Slider.Track>
                            <Slider.Indicator />
                            <Slider.Thumb aria-label="Volume" />
                        </Slider.Track>
                    </Slider.Control>
                </Slider.Root>
                <button type="submit">Submit</button>
            </form>
            <Output
                values={{
                    value: value(),
                    committed: committed(),
                    form: form(),
                }}
            />
        </>
    );
}
