import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rating',
  standalone: true
})
export class RatingPipe implements PipeTransform {
  transform(rating: number | null | undefined, decimals: number = 1): string {
    if (rating === null || rating === undefined || isNaN(rating)) {
      return 'N/A';
    }
    return rating.toFixed(decimals);
  }
}