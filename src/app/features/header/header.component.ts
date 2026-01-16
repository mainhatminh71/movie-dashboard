import { Component, signal, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, NzSwitchModule, NzIconModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  mobileMenuOpen = signal<boolean>(false);
  isDarkMode = false;
  @ViewChild('checkedIcon', { static: true }) checkedIcon!: TemplateRef<void>;
  @ViewChild('uncheckedIcon', { static: true }) uncheckedIcon!: TemplateRef<void>;

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

