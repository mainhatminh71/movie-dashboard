import { ChangeDetectionStrategy, Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { computed } from '@angular/core';
@Component({
  selector: 'app-year-select',
  imports: [CommonModule],
  templateUrl: './year-select.component.html',
  styleUrl: './year-select.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class YearSelectComponent {
@Input() selectedYear: number | null = null;
@Input() startYear: number = 1900;
@Input() endYear: number = new Date().getFullYear();
@Output() yearChange = new EventEmitter<number | null>();
 _uniqueId = `year-${Math.random().toString(36).substr(2, 9)}`;

years = computed(() => {
  const years: number[] = []
  for (let year = this.endYear; year >= this.startYear; year--) {
    years.push(year);
  }
  return years;
})
onYearChange(event: Event): void {
  const value = (event.target as HTMLSelectElement).value;
  const year = value ? +value : null;
  this.yearChange.emit(year);
}
}
