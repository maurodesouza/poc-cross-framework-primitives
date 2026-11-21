<script lang="ts">
import { dialog } from "@poc/styles";
import { type ChangeDetails, Dialog } from "@poc/svelte";
import Output from "../../kit/output.svelte";

let open = $state(false);
let reason = $state<string>();
</script>

<div class="h-[200vh]"><Dialog.Root bind:open onOpenChange={(_: boolean, details: ChangeDetails) => (reason = details.reason)}><Dialog.Trigger class={dialog.trigger}>Open dialog</Dialog.Trigger><Dialog.Portal><Dialog.Backdrop class={dialog.backdrop} /><Dialog.Popup class={dialog.popup}><Dialog.Title class={dialog.title}>Edit profile</Dialog.Title><Dialog.Description class={dialog.description}>Change your display name.</Dialog.Description><label class="flex flex-col gap-1 text-sm">
                    Name
                    <input type="text" class="h-9 rounded-md border border-palette-line px-2" /></label><div class="flex justify-end gap-2"><Dialog.Close class={dialog.close}>Save</Dialog.Close><Dialog.Close class={dialog.close}>Close</Dialog.Close></div></Dialog.Popup></Dialog.Portal></Dialog.Root><button type="button" class="ms-2">Outside button</button><Output values={{ open, reason }} /></div>
