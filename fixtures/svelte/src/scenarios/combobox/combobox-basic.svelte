<script lang="ts">
import type { ChangeDetails } from "@poc/svelte";
import Output from "../../kit/output.svelte";
import FruitCombobox from "./fruit-combobox.svelte";

let value = $state<string | null>(null);
let input = $state("");
let open = $state(false);
let reason = $state<string>();
</script>

<FruitCombobox bind:value bind:inputValue={input} bind:open onOpenChange={(_: boolean, details: ChangeDetails) => (reason = details.reason)} /><Output values={{ value, input, open, reason }} />
