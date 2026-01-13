import { ChangeDetectionStrategy, Component, EventEmitter,  Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating-slider',
  imports: [CommonModule],
  templateUrl: './rating-slider.component.html',
  styleUrl: './rating-slider.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RatingSliderComponent {
  @Input() min: number = 0;
  @Input() max: number = 10;
  @Input() step: number = 0.5;
  @Input({ required: true }) value!: number;
  @Output() valueChange = new EventEmitter<number>();
   _uniqueId = `rating-${Math.random().toString(36).substr(2, 9)}`;

  onInput(event: Event): void {
    const newValue = +(event.target as HTMLInputElement).value;
    this.valueChange.emit(newValue);
  }

  get displayValue(): string {
    return this.value > 0 ? this.value.toFixed(1) : 'Any';
  }
}
