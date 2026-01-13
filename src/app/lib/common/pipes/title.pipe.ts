import { Pipe, PipeTransform } from '@angular/core';
import { Movie } from 'src/app/core/models/movie.model';
import { TVShow } from 'src/app/core/models/tvshow.model';
import { getTitle } from '../utils/movie.util';

@Pipe({
  name: 'movieTitle',
  standalone: true
})
export class TitlePipe implements PipeTransform {
  transform(item: Movie | TVShow | null | undefined): string {
    if (!item) return 'N/A';
    return getTitle(item);
  }
}