import { Component, signal, ViewEncapsulation } from "@angular/core";
import {
    CheckboxIndicator,
    CheckboxRoot,
    SliderControl,
    SliderIndicator,
    SliderRoot,
    SliderThumb,
    SliderTrack,
} from "@poc/angular";
import { checkbox, field, select, slider } from "@poc/styles";
import { formEntries } from "../../kit/form-entries.ts";
import { Output } from "../../kit/output.ts";
import { FRUIT_ITEMS } from "../select/fruit-items.ts";
import { SELECT_PARTS } from "../select/select-parts.ts";
import { FIELD_PARTS } from "./field-parts.ts";

/** A Checkbox, a Select and a Slider inside fields: the field names them (spec/field.md). */
@Component({
    selector: "[scenario-field-controls]",
    encapsulation: ViewEncapsulation.None,
    imports: [
        FIELD_PARTS,
        CheckboxRoot,
        CheckboxIndicator,
        SELECT_PARTS,
        SliderRoot,
        SliderControl,
        SliderTrack,
        SliderIndicator,
        SliderThumb,
        Output,
    ],
    template: `
        <form class="flex flex-col items-start gap-4" (submit)="submit($event)">
            <div fieldRoot [name]="'terms'" [class]="styles.root">
                <div class="flex items-center gap-2">
                    <button checkboxRoot #termsBox="checkboxRoot" required [class]="checkboxStyles.root"><span *checkboxIndicator [class]="checkboxStyles.indicator">{{ termsBox.state().indeterminate ? "–" : "✓" }}</span></button>
                    <label fieldLabel [class]="styles.label">Accept terms</label>
                </div>
                <p fieldDescription [class]="styles.description">Required to continue.</p>
                <div *fieldError [class]="styles.error">You must accept the terms.</div>
            </div>
            <div fieldRoot [name]="'fruit'" [class]="styles.root">
                <label fieldLabel [class]="styles.label">Fruit</label>
                <ng-container selectRoot [items]="items" required>
                    <button selectTrigger [class]="selectStyles.trigger"><span selectValue placeholder="Choose a fruit" [class]="selectStyles.value"></span></button>
                    <ng-container *selectPortal>
                        <div selectPositioner [class]="selectStyles.positioner">
                            <div selectPopup [class]="selectStyles.popup">
                                <div selectList [class]="selectStyles.list">
                                    @for (item of items; track item.value) {
                                        <div selectItem [value]="item.value" [class]="selectStyles.item">{{ item.label }}<span *selectItemIndicator [class]="selectStyles['item-indicator']">✓</span></div>
                                    }
                                </div>
                            </div>
                        </div>
                    </ng-container>
                </ng-container>
                <p fieldDescription [class]="styles.description">Pick one.</p>
                <div *fieldError [class]="styles.error">Choose a fruit.</div>
            </div>
            <div fieldRoot [name]="'volume'" [class]="styles.root">
                <label fieldLabel [class]="styles.label">Volume</label>
                <div sliderRoot [defaultValue]="50" [class]="sliderStyles.root">
                    <div sliderControl [class]="sliderStyles.control"><div sliderTrack [class]="sliderStyles.track"><div sliderIndicator [class]="sliderStyles.indicator"></div><div sliderThumb [class]="sliderStyles.thumb"></div></div></div>
                </div>
                <p fieldDescription [class]="styles.description">From 0 to 100.</p>
            </div>
            <button type="submit">Submit</button>
        </form>
        <pre fixtureOutput [values]="{ form: form() }"></pre>
    `,
})
export class FieldControls {
    protected readonly styles = field;
    protected readonly checkboxStyles = checkbox;
    protected readonly selectStyles = select;
    protected readonly sliderStyles = slider;
    protected readonly items = FRUIT_ITEMS;
    protected readonly form = signal<string | undefined>(undefined);

    protected submit(event: SubmitEvent): void {
        event.preventDefault();
        this.form.set(formEntries(event.currentTarget as HTMLFormElement));
    }
}
