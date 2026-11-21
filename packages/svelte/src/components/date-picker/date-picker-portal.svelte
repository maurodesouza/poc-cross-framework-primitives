<script lang="ts">
import type { Snippet } from "svelte";
import Portal from "../shared/portal.svelte";
import { DatePickerContext } from "./date-picker-context.svelte.ts";

let { container, children }: { container?: Element | null; children: Snippet } =
    $props();
const context = DatePickerContext.use("DatePicker.Portal");
</script>

<Portal mounted={context.presence.mounted} {container} {children} />
