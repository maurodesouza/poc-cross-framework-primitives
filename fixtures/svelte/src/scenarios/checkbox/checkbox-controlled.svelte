<script lang="ts">
import Output from "../../kit/output.svelte";
import StyledCheckbox from "./styled-checkbox.svelte";

// The consumer refuses to clear the checkbox: it stays checked.
let checked = $state(true);
let requested = $state<boolean>();
</script>

<label class="flex items-center gap-2 text-sm"><StyledCheckbox bind:checked={() => checked, (next) => { if (next) checked = true; }} onCheckedChange={(next: boolean) => (requested = next)} />Keep me signed in</label><Output values={{ checked, requested }} />
