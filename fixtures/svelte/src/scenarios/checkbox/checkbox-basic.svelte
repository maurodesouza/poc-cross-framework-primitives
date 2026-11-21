<script lang="ts">
import { formEntries } from "../../kit/form-entries.ts";
import Output from "../../kit/output.svelte";
import StyledCheckbox from "./styled-checkbox.svelte";

let terms = $state<boolean>();
let form = $state<string>();
const onsubmit = (event: SubmitEvent) => {
    event.preventDefault();
    form = formEntries(event.currentTarget as HTMLFormElement);
};
</script>

<form class="flex flex-col items-start gap-2" {onsubmit}><label class="flex items-center gap-2 text-sm"><StyledCheckbox name="terms" required onCheckedChange={(checked: boolean) => (terms = checked)} />Accept terms</label><label class="flex items-center gap-2 text-sm"><StyledCheckbox name="news" value="yes" defaultChecked />Subscribe</label><label class="flex items-center gap-2 text-sm"><StyledCheckbox disabled />Locked</label><div class="flex gap-2"><button type="submit">Submit</button><button type="reset">Reset</button></div></form><Output values={{ terms, form }} />
