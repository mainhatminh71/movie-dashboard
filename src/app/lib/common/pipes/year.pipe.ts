import { Pipe, PipeTransform } from '@angular/core';
import { getYear } from '../utils/date.util';

@Pipe({
  name: 'year',
  standalone: true
})
export class YearPipe implements PipeTransform {
  transform(dateString: string | null | undefined): string {
    return getYear(dateString);
  }
}