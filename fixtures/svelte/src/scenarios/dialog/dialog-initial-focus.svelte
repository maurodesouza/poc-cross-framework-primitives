<script lang="ts">
import { dialog } from "@poc/styles";
import { Dialog } from "@poc/svelte";

let cancel = $state<HTMLElement | null>(null);
</script><Dialog.Root><Dialog.Trigger class={dialog.trigger}>Delete file</Dialog.Trigger><Dialog.Portal><Dialog.Backdrop class={dialog.backdrop} /><Dialog.Popup class={dialog.popup} initialFocus={() => cancel}><Dialog.Title class={dialog.title}>Delete file?</Dialog.Title><div class="flex justify-end gap-2"><button type="button">Delete</button><Dialog.Close class={dialog.close}>
                    {#snippet child({ props })}
                        <button {...props} bind:this={cancel}>Cancel</button>
                    {/snippet}
                </Dialog.Close></div></Dialog.Popup></Dialog.Portal></Dialog.Root>
