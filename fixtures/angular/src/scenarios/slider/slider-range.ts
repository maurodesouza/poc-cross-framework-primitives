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

const LABELS = ["Minimum price", "Maximum price"];

@Component({
    selector: "[scenario-slider-range]",
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
            <div sliderRoot [defaultValue]="initial" [minStepsBetweenValues]="10" name="price" (valueChange)="value.set(range($event))" [class]="styles.root">
                <div sliderControl data-testid="control" [class]="styles.control"><div sliderTrack [class]="styles.track"><div sliderIndicator [class]="styles.indicator"></div>@for (label of labels; track label; let index = $index) {<div sliderThumb [index]="index" [attr.aria-label]="label" [getAriaValueText]="price" [class]="styles.thumb"></div>}</div></div>
            </div>
            <button type="submit">Submit</button>
        </form>
        <pre fixtureOutput [values]="{ value: value().join(','), form: form() }"></pre>
    `,
})
export class SliderRange {
    protected readonly styles = slider;
    protected readonly labels = LABELS;
    protected readonly initial = [20, 80];
    protected readonly value = signal<readonly number[]>([20, 80]);
    protected readonly form = signal<string | undefined>(undefined);
    protected readonly range = (value: SliderValue) =>
        value as readonly number[];
    protected readonly price = (value: number) => `$${value}`;

    protected submit(event: SubmitEvent): void {
        event.preventDefault();
        this.form.set(formEntries(event.currentTarget as HTMLFormElement));
    }
}
