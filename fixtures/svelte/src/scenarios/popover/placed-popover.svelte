<script lang="ts">
import { popover } from "@poc/styles";
import { Popover } from "@poc/svelte";

/** A popover whose popup is titled "Placed", placed by its Positioner props. */
let {
    label,
    side,
    align,
}: {
    label: string;
    side: "top" | "bottom" | "start" | "end";
    align?: "start" | "center" | "end";
} = $props();
</script><Popover.Root><Popover.Trigger class={popover.trigger}>{label}</Popover.Trigger><Popover.Portal><Popover.Positioner class={popover.positioner} {side} {align} sideOffset={4}><Popover.Popup class={popover.popup}><Popover.Title class={popover.title}>Placed</Popover.Title></Popover.Popup></Popover.Positioner></Popover.Portal></Popover.Root>
