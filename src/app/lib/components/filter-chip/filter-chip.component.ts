import { ChangeDetectionStrategy, Component, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filter-chip',
  imports: [CommonModule],
  templateUrl: './filter-chip.component.html',
  styleUrl: './filter-chip.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterChipComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) isActive!: boolean;
  @Output() clicked = new EventEmitter<void>(); 
  onClick(): void {
    this.clicked.emit();
  }
}
