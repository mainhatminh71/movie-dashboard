import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from '../../../features/header/header.component';
import { LeftSideComponent } from '../../../features/left-side/left-side.component';
import { MainContentComponent } from '../../../features/main-content/main-content.component';
import { CommonModule } from '@angular/common';
import { Subscription, filter } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs';

@Component({
  selector: 'app-main-layout',
  imports: [CommonModule, RouterOutlet, HeaderComponent, LeftSideComponent, MainContentComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  standalone: true,
})
export class MainLayoutComponent implements OnInit, OnDestroy{
  private router = inject(Router);
  private routerSubscription!: Subscription;
  
  private currentUrl = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url)
    ),
    {initialValue: this.router.url}
  );
  
  isHomeRoute(): boolean {
    const url = this.currentUrl();
    return url === '/' || url === '/home' || url === '';
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
