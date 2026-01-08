import { Component} from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { LeftSideComponent } from "./export-result/left-side/left-side.component";
import { HeaderComponent } from "./export-result/header/header.component";
import { MainContentComponent } from "./export-result/main-content/main-content.component";
import { RightSidebarComponent } from "./export-result/right-sidebar/right-sidebar.component";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
    imports: [CommonModule, RouterOutlet, LeftSideComponent, HeaderComponent, MainContentComponent, RightSidebarComponent],
    standalone: true
})
export class AppComponent {
  title = "Movie DashBoard";
}
