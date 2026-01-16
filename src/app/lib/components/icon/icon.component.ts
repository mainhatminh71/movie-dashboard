import { Component, ChangeDetectionStrategy, Input, HostBinding } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';

export type IconName = 'home' | 'watchlist' | 'discover' | 'settings';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NzIconModule]
})
export class IconComponent {
  @Input() name: IconName = 'home';
  @Input() size: number = 24;

  @HostBinding('style.width.px')
  @HostBinding('style.height.px')
  get iconSize(): number {
    return this.size;
  }
}
