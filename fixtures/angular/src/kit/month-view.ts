import {
    Component,
    input,
    numberAttribute,
    ViewEncapsulation,
} from "@angular/core";
import {
    CalendarCell,
    CalendarGrid,
    CalendarGridBody,
    CalendarGridHeader,
    CalendarHeaderCell,
    CalendarHeading,
    CalendarNextButton,
    CalendarPrevButton,
    CalendarRow,
    type PlainDate,
} from "@poc/angular";
import { calendar } from "@poc/styles";

/**
 * The month header and one grid, as every calendar scenario shows them. The component is the
 * `<div class="flex flex-col gap-2">` of React's MonthView (an attribute selector); its parts
 * find the calendar root around it by injection.
 */
@Component({
    selector: "div[monthView]",
    encapsulation: ViewEncapsulation.None,
    imports: [
        CalendarPrevButton,
        CalendarNextButton,
        CalendarHeading,
        CalendarGrid,
        CalendarGridHeader,
        CalendarHeaderCell,
        CalendarGridBody,
        CalendarRow,
        CalendarCell,
    ],
    host: { class: "flex flex-col gap-2" },
    template: `
        <div class="flex items-center justify-between gap-2">
            @if (withButtons()) {
                <button calendarPrevButton aria-label="Previous month" [class]="styles['prev-button']">‹</button>
            } @else {
                <span class="size-8"></span>
            }
            <h2 calendarHeading #heading="calendarHeading" [offset]="offset()" [class]="styles.heading">{{ heading.month() }}</h2>
            @if (withButtons()) {
                <button calendarNextButton aria-label="Next month" [class]="styles['next-button']">›</button>
            } @else {
                <span class="size-8"></span>
            }
        </div>
        <table calendarGrid [offset]="offset()" [class]="styles.grid">
            <thead calendarGridHeader #header="calendarGridHeader">
                <tr>
                    @for (weekday of header.weekdays(); track weekday.index) {
                        <th calendarHeaderCell [weekday]="weekday" [class]="styles['header-cell']">{{ weekday.short }}</th>
                    }
                </tr>
            </thead>
            <tbody calendarGridBody #body="calendarGridBody">
                @for (week of body.weeks(); track key(week[0])) {
                    <tr calendarRow>
                        @for (date of week; track key(date)) {
                            <td calendarCell #cell="calendarCell" [date]="date" [class]="styles.cell">{{ cell.dayNumber() }}</td>
                        }
                    </tr>
                }
            </tbody>
        </table>
    `,
})
export class MonthView {
    protected readonly styles = calendar;
    readonly offset = input(0, { transform: numberAttribute });
    readonly withButtons = input(true);

    protected key(date: PlainDate | undefined): string {
        return date ? `${date.year}-${date.month}-${date.day}` : "";
    }
}
