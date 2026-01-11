import { Component, inject, OnInit, OnDestroy} from "@angular/core";
import { CommonModule } from "@angular/common";
import { NavigationEnd, RouterOutlet, Router } from "@angular/router";
import { LeftSideComponent } from "./export-result/left-side/left-side.component";
import { HeaderComponent } from "./export-result/header/header.component";
import { MainContentComponent } from "./export-result/main-content/main-content.component";
import { toSignal } from "@angular/core/rxjs-interop";
import { filter, map, startWith, Subscription } from "rxjs";
import { computed } from "@angular/core";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
    imports: [CommonModule, RouterOutlet, LeftSideComponent, HeaderComponent, MainContentComponent],
    standalone: true
})
export class AppComponent implements OnInit, OnDestroy {
  title = "Movie DashBoard";
  private router = inject(Router);
  private routerSubscription?: Subscription;
  
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

  ngOnInit(): void {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      setTimeout(() => {
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
          mainContent.scrollTop = 0;
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 0);
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}







