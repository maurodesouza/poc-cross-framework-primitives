<script lang="ts">
import type { Snippet } from "svelte";
import Portal from "../shared/portal.svelte";
import { DialogContext } from "./dialog-context.svelte.ts";

/** Moves the backdrop and the popup to the end of `body` while the dialog is open or closing. */
let { container, children }: { container?: Element | null; children: Snippet } =
    $props();
const context = DialogContext.use("Dialog.Portal");
</script>

<Portal mounted={context.presence.mounted} {container} {children} />
