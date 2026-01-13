import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import {RouterModule} from '@angular/router';
import { IconComponent } from "../../../features/icon/icon.component";
import { StorageService } from '../../../core/services/moviestorage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, IconComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  private storageService = inject(StorageService);
  watchListCount = this.storageService.count;
  
  closeMobileMenu() : void {
    const sidebar = document.querySelector('.sidebar');
    const backdrop = document.querySelector('.sidebar-backdrop');
    if (sidebar && backdrop) {
      sidebar.classList.remove('mobile-open');
      backdrop.classList.remove('mobile-open');
    }
  }
}
