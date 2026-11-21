<script lang="ts">
import { dialog } from "@poc/styles";
import { type ChangeDetails, Dialog } from "@poc/svelte";
import Output from "../../kit/output.svelte";

// The consumer keeps `open` true: Escape, an outside press and Close change nothing.
let open = $state(false);
let reason = $state<string>();
</script><button type="button" onclick={() => (open = true)}>Open dialog</button><Dialog.Root bind:open={() => open, (next) => { if (next) open = true; }} onOpenChange={(_: boolean, details: ChangeDetails) => (reason = details.reason)}><Dialog.Portal><Dialog.Backdrop class={dialog.backdrop} /><Dialog.Popup class={dialog.popup}><Dialog.Title class={dialog.title}>Locked</Dialog.Title><Dialog.Close class={dialog.close}>Close</Dialog.Close></Dialog.Popup></Dialog.Portal></Dialog.Root><Output values={{ open, reason }} />
