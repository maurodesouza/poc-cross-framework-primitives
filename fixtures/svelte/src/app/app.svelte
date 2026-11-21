<script lang="ts">
import { readQuery } from "../kit/query.ts";
import { routes } from "./routes.ts";

const query = readQuery(window.location.search);
document.documentElement.dir = query.dir;
document.documentElement.lang = query.locale;
const Scenario = routes[window.location.pathname];
const paths = Object.keys(routes);
</script>

{#if Scenario}
    <main class="p-6"><Scenario locale={query.locale} /></main>
{:else}
    <main class="p-6">
        <h1 class="text-lg font-semibold">Svelte fixture</h1>
        <ul>
            {#each paths as path (path)}
                <li><a href={path}>{path}</a></li>
            {/each}
        </ul>
    </main>
{/if}
