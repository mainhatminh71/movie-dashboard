import { Component, Input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Movie } from '../../../core/models/movie.model';
import { TVShow } from '../../../core/models/tvshow.model';
import { Router } from '@angular/router';
import { ImageUrlPipe, YearPipe, RatingPipe, TitlePipe } from '../../common/pipes';
import { getReleaseDate } from '../../common/utils/movie.util';
import { getPlaceholderImage } from '../../common/utils/image.util';

type MovieCardSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'app-movie-card',
  imports: [CommonModule, ImageUrlPipe, YearPipe, RatingPipe, TitlePipe],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
  standalone: true
})
export class MovieCardComponent {
  private router = inject(Router);

  @Input({required: true}) movie!: Movie | TVShow;
  @Input() showRating: boolean = true;
  @Input() size: MovieCardSize = 'medium';

  cardClick = output<Movie | TVShow>();

  getReleaseDate(): string | null {
    return getReleaseDate(this.movie);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = getPlaceholderImage();
    }
  }

  onCardClick(): void {
    this.cardClick.emit(this.movie);
    const type = 'title' in this.movie ? 'movie' : 'tv';
    this.router.navigate([type, this.movie.id]);
  }

}
