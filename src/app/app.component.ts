import { Component} from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { LeftSideComponent } from "./export-result/left-side/left-side.component";
@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
    imports: [CommonModule, RouterOutlet, LeftSideComponent],
    standalone: true
})
export class AppComponent {
  title = "Movie DashBoard";
}
