import { Component, inject} from "@angular/core";
import { CommonModule } from "@angular/common";
import { NavigationEnd, RouterOutlet } from "@angular/router";
import { LeftSideComponent } from "./export-result/left-side/left-side.component";
import { HeaderComponent } from "./export-result/header/header.component";
import { MainContentComponent } from "./export-result/main-content/main-content.component";
import { RightSidebarComponent } from "./export-result/right-sidebar/right-sidebar.component";
import { Router } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { filter, map, startWith } from "rxjs";
import { computed } from "@angular/core";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
    imports: [CommonModule, RouterOutlet, LeftSideComponent, HeaderComponent, MainContentComponent, RightSidebarComponent],
    standalone: true
})
export class AppComponent {
  title = "Movie DashBoard";
  private router = inject(Router);
  private currentUrl = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url)
    ),
    {initialValue: this.router.url}
  )
  private isHome(): boolean {
    const url = this.currentUrl();
    return url === '/' || url === '/home' || url === '';
  }
  isHomeRoute(): boolean {
    return this.isHome();
  }

}







