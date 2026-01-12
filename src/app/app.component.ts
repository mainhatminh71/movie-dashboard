import { Component } from "@angular/core";
import { MainLayoutComponent } from "./lib/layouts/main-layout/main-layout.component";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
    imports: [MainLayoutComponent],
    standalone: true
})
export class AppComponent {
  title = "Movie DashBoard";
}







