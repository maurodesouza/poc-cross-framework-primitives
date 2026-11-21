<script lang="ts">
import { popover } from "@poc/styles";
import { type ChangeDetails, Popover } from "@poc/svelte";
import Output from "../../kit/output.svelte";

let open = $state(false);
let reason = $state<string>();
</script><Popover.Root bind:open onOpenChange={(_: boolean, details: ChangeDetails) => (reason = details.reason)}><Popover.Trigger class={popover.trigger}>Open popover</Popover.Trigger><Popover.Portal><Popover.Positioner class={popover.positioner} sideOffset={4}><Popover.Popup class={popover.popup}><Popover.Title class={popover.title}>Notifications</Popover.Title><Popover.Description class={popover.description}>You have 3 unread messages.</Popover.Description><button type="button">Mark all as read</button><Popover.Close class={popover.close}>Close</Popover.Close></Popover.Popup></Popover.Positioner></Popover.Portal></Popover.Root><button type="button" class="ms-2">After trigger</button><Output values={{ open, reason }} />
