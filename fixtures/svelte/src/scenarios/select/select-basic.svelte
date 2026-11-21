<script lang="ts">
import { formEntries } from "../../kit/form-entries.ts";
import Output from "../../kit/output.svelte";
import FruitSelect from "./fruit-select.svelte";

let value = $state<string | null>(null);
let open = $state(false);
let reason = $state<string>();
let form = $state<string>();
const onsubmit = (event: SubmitEvent) => {
    event.preventDefault();
    form = formEntries(event.currentTarget as HTMLFormElement);
};
</script>

<form class="flex flex-col items-start gap-2" {onsubmit}><label for="fruit" class="text-sm font-medium">Fruit</label><FruitSelect id="fruit" name="fruit" required onValueChange={(next) => (value = next)} onOpenChange={(next, why) => { open = next; reason = why; }} /><div class="flex gap-2"><button type="submit">Submit</button><button type="reset">Reset</button></div></form><Output values={{ value, open, reason, form }} />
