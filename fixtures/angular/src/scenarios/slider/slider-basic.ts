import { Component, signal, ViewEncapsulation } from "@angular/core";
import {
    SliderControl,
    SliderIndicator,
    SliderRoot,
    SliderThumb,
    SliderTrack,
    type SliderValue,
} from "@poc/angular";
import { slider } from "@poc/styles";
import { formEntries } from "../../kit/form-entries.ts";
import { Output } from "../../kit/output.ts";

/** Also `/slider/rtl` (the page sets `dir`). */
@Component({
    selector: "[scenario-slider-basic]",
    encapsulation: ViewEncapsulation.None,
    imports: [
        SliderRoot,
        SliderControl,
        SliderTrack,
        SliderIndicator,
        SliderThumb,
        Output,
    ],
    template: `
        <form class="flex flex-col items-start gap-2" (submit)="submit($event)">
            <div sliderRoot [defaultValue]="50" name="volume" (valueChange)="value.set(single($event))" (valueCommit)="committed.set(single($event))" [class]="styles.root">
                <div sliderControl data-testid="control" [class]="styles.control"><div sliderTrack [class]="styles.track"><div sliderIndicator [class]="styles.indicator"></div><div sliderThumb aria-label="Volume" [class]="styles.thumb"></div></div></div>
            </div>
            <button type="submit">Submit</button>
        </form>
        <pre fixtureOutput [values]="{ value: value(), committed: committed(), form: form() }"></pre>
    `,
})
export class SliderBasic {
    protected readonly styles = slider;
    protected readonly value = signal<number | undefined>(undefined);
    protected readonly committed = signal<number | undefined>(undefined);
    protected readonly form = signal<string | undefined>(undefined);
    protected readonly single = (value: SliderValue) => value as number;

    protected submit(event: SubmitEvent): void {
        event.preventDefault();
        this.form.set(formEntries(event.currentTarget as HTMLFormElement));
    }
}
