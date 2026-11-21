<script lang="ts">
import { tooltip } from "@poc/styles";
import { type ChangeDetails, Tooltip } from "@poc/svelte";
import Output from "../../kit/output.svelte";

let open = $state(false);
let reason = $state<string>();
</script>

<div class="flex gap-2"><button type="button">Before</button><Tooltip.Root delay={500} bind:open onOpenChange={(_: boolean, details: ChangeDetails) => (reason = details.reason)}><Tooltip.Trigger class={tooltip.trigger}>Save</Tooltip.Trigger><Tooltip.Portal><Tooltip.Positioner sideOffset={6} class={tooltip.positioner}><Tooltip.Popup class={tooltip.popup}><Tooltip.Arrow class={tooltip.arrow} />Save the document</Tooltip.Popup></Tooltip.Positioner></Tooltip.Portal></Tooltip.Root></div><Output values={{ open, reason }} />
