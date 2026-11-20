<script setup lang="ts">
import { readQuery } from "../kit/query.ts";
import { routes } from "./routes.ts";

const query = readQuery(window.location.search);
document.documentElement.dir = query.dir;
document.documentElement.lang = query.locale;
const scenario = routes[window.location.pathname];
const paths = Object.keys(routes);
</script>

<template>
    <main v-if="scenario" class="p-6">
        <component :is="scenario" :locale="query.locale" />
    </main>
    <main v-else class="p-6">
        <h1 class="text-lg font-semibold">Vue fixture</h1>
        <ul>
            <li v-for="path in paths" :key="path">
                <a :href="path">{{ path }}</a>
            </li>
        </ul>
    </main>
</template>
