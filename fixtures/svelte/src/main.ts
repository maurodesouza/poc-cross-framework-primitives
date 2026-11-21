import { mount } from "svelte";
import App from "./app/app.svelte";
import "./app/app.css";

const target = document.getElementById("root");
if (target === null) {
    throw new Error("missing #root");
}
mount(App, { target });
