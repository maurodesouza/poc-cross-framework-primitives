import { render } from "@solidjs/web";
import { App } from "./app/app.tsx";
import "./app/app.css";

const root = document.getElementById("root");
if (root === null) {
    throw new Error("missing #root");
}
render(() => <App />, root);
