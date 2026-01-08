import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { bootstrapApplication } from "@angular/platform-browser";
import { AppConfig } from "./app/app.config";
import { AppComponent } from "./app/app.component";

bootstrapApplication(AppComponent, AppConfig).catch((err) => console.error("Message error"));
