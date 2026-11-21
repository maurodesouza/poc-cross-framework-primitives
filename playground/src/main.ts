import { mountShell } from "./app/shell.ts";
import { SHOWN } from "./kit/implementations.ts";
import { SCENARIOS } from "./scenarios/scenarios.ts";
import "./app/app.css";

const root = document.getElementById("root");
if (root === null) {
    throw new Error("missing #root");
}
mountShell(root, SCENARIOS, SHOWN);
