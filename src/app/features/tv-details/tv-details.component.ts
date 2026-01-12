import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TVShowService } from 'src/app/core/services/tvshow.service';
import { TVShowStore } from 'src/app/core/stores/tvshow.store';
import { StorageService } from 'src/app/core/services/moviestorage.service';
import { forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tv-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tv-details.component.html',
  styleUrl: './tv-details.component.scss'
})
export class TvDetailsComponent implements OnInit{
  private tvShowService = inject(TVShowService);
  private tvShowStore = inject(TVShowStore);
  private storageService = inject(StorageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  tv = signal<any>(null);
  cast = signal<any[]>([]);
  reviews = signal<any[]>([]);
  similarTVShows = signal<any[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  referrer = signal<string>('home'); // 'home' or 'discover'
  isInWatchlist = signal<boolean>(false);

  currentTVShowId = this.tvShowStore.currentTVShowId;
  currentName = this.tvShowStore.currentName;
  poster_path = this.tvShowStore.poster_path;
  backdrop_path = this.tvShowStore.backdrop_path;
  overview = this.tvShowStore.overview;
  first_air_date = this.tvShowStore.first_air_date;
  vote_average = this.tvShowStore.vote_average;
  genre_id_list = this.tvShowStore.genre_id_list;

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.scrollTop = 0;
    }

    // Get referrer from history state
    const state = (window.history as any).state;
    if (state && state.referrer) {
      this.referrer.set(state.referrer);
    } else {
      this.referrer.set('home');
    }

    (this.route.params as any).subscribe((params: Record<string, string>) => {
      const id = +params['id'];
      if (id) {
        this.loadTVData(id);
      }
    });
  }

  loadTVData(tvId: number): void {
    this.loading.set(true);
    this.error.set(null);
    this.tvShowStore.setLoading(true);
    this.tvShowStore.setError('');

    forkJoin({
      details: this.tvShowService.getTVDetails(tvId),
      credits: this.tvShowService.getTVCredits(tvId),
      reviews: this.tvShowService.getTVReviews(tvId),
      similar: this.tvShowService.getTVSimilar(tvId)
    }).subscribe({
      next: (data: any) => {
        const tvDetails = data.details;
        this.tv.set(tvDetails);
        
        this.tvShowStore.currentTVShowId.set(tvId);
        this.tvShowStore.currentName.set(tvDetails.name || '');
        this.tvShowStore.poster_path.set(tvDetails.poster_path || null);
        this.tvShowStore.backdrop_path.set(tvDetails.backdrop_path || null);
        this.tvShowStore.overview.set(tvDetails.overview || '');
        this.tvShowStore.first_air_date.set(tvDetails.first_air_date || null);
        this.tvShowStore.vote_average.set(tvDetails.vote_average || 0);
        
        if (tvDetails.genres && tvDetails.genres.length > 0) {
          const genreIds = tvDetails.genres.map((g: any) => g.id);
          this.tvShowStore.genre_id_list.set(genreIds);
        } else {
          this.tvShowStore.genre_id_list.set([]);
        }

        this.cast.set(data.credits?.cast || []);
        this.reviews.set(data.reviews?.results || []);
        this.similarTVShows.set(data.similar?.results || []);
        
        // Check if TV show is in watchlist
        this.isInWatchlist.set(this.storageService.checkItemById(tvId));
        
        this.loading.set(false);
        this.tvShowStore.setLoading(false);
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        const errorMessage = 'Failed to load TV show details';
        this.error.set(errorMessage);
        this.tvShowStore.setError(errorMessage);
        this.loading.set(false);
        this.tvShowStore.setLoading(false);
        this.cdr.markForCheck();
        console.error('Error loading TV show details:', err);
      }
    });
  }

  getImageUrl(path: string | null, size: string = 'w500'): string {
    if (!path) {
      return 'https://via.placeholder.com/500x750?text=No+Image';
    }
    return `${environment.tmdbImageBaseUrl}${size}${path}`;
  }

  getYear(dateString: string | null): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).getFullYear().toString();
  }

  navigateToTVDetails(tvId: number): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.router.navigate(['/tv', tvId]).then(() => {
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.scrollTop = 0;
      }
    });
  }

  formatRuntime(minutes: number): string {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  onImageError(event: Event, size: string = '500x750'): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = `https://via.placeholder.com/${size}?text=No+Image`;
    }
  }

  goBack(): void {
    const referrerValue = this.referrer();
    if (referrerValue === 'discover') {
      this.router.navigate(['/discover']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  toggleWatchlist(): void {
    const tvShow = this.tv();
    if (tvShow) {
      const tvShowData = {
        id: tvShow.id,
        name: tvShow.name,
        poster_path: tvShow.poster_path,
        backdrop_path: tvShow.backdrop_path,
        overview: tvShow.overview,
        first_air_date: tvShow.first_air_date,
        vote_average: tvShow.vote_average,
        genre_ids: tvShow.genres?.map((g: any) => g.id) || []
      };
      if (this.storageService.checkTVShowById(tvShow.id)) {
        this.storageService.removeTVShow(tvShowData);
      } else {
        this.storageService.addTVShow(tvShowData);
      }
      this.isInWatchlist.set(this.storageService.checkItemById(tvShow.id));
    }
  }
}

