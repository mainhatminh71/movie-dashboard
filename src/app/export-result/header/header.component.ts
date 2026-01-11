import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  mobileMenuOpen = signal<boolean>(false);

  toggleMobileMenu(): void {
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
    const sidebar = document.querySelector('.left-side_54-43');
    const backdrop = document.querySelector('.bg_2-9');
    
    if (sidebar && backdrop) {
      if (this.mobileMenuOpen()) {
        sidebar.classList.add('mobile-open');
        backdrop.classList.add('mobile-open');
      } else {
        sidebar.classList.remove('mobile-open');
        backdrop.classList.remove('mobile-open');
      }
    }
  }
}

