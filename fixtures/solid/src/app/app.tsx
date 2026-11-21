import { For } from "solid-js";
import { readQuery } from "../kit/query.ts";
import { routes } from "./routes.ts";

export function App() {
    const query = readQuery(window.location.search);
    document.documentElement.dir = query.dir;
    document.documentElement.lang = query.locale;
    const Scenario = routes[window.location.pathname];
    if (Scenario === undefined) {
        return (
            <main class="p-6">
                <h1 class="text-lg font-semibold">Solid fixture</h1>
                <ul>
                    <For each={Object.keys(routes)}>
                        {(path) => (
                            <li>
                                <a href={path}>{path}</a>
                            </li>
                        )}
                    </For>
                </ul>
            </main>
        );
    }
    return (
        <main class="p-6">
            <Scenario locale={query.locale} />
        </main>
    );
}
