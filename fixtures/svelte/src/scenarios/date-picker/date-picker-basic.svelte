<script lang="ts">
import { calendar, datePicker } from "@poc/styles";
import {
    Calendar,
    type ChangeDetails,
    DatePicker,
    type PlainDate,
} from "@poc/svelte";
import { iso } from "../../kit/iso.ts";
import MonthView from "../../kit/month-view.svelte";
import Output from "../../kit/output.svelte";

let { locale }: { locale: string } = $props();
let value = $state<PlainDate | null>(null);
let open = $state(false);
let reason = $state<string>();
</script>

<DatePicker.Root bind:value={value as never} bind:open {locale} onOpenChange={(_: boolean, details: ChangeDetails) => (reason = details.reason)}><DatePicker.Trigger class={datePicker.trigger}>{#each ["Choose date: ", iso(value) ?? "none"] as run}{run}{/each}</DatePicker.Trigger><DatePicker.Portal><DatePicker.Positioner sideOffset={4} class={datePicker.positioner}><DatePicker.Popup class={datePicker.popup}><Calendar.Root class={calendar.root}><MonthView /></Calendar.Root></DatePicker.Popup></DatePicker.Positioner></DatePicker.Portal></DatePicker.Root><Output values={{ value: iso(value), open, reason }} />
