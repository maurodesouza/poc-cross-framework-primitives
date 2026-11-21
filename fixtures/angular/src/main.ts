import { bootstrapApplication } from "@angular/platform-browser";
import { App } from "./app/app.ts";
import "./app/app.css";

// zoneless (Angular 22's default): no zone.js anywhere
bootstrapApplication(App).catch((error: unknown) => console.error(error));
