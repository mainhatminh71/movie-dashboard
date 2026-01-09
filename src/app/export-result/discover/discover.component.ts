import { ChangeDetectionStrategy, Component, Input, OnInit, inject, signal, effect, ChangeDetectorRef } from "@angular/core";
import { MovieService } from "src/app/core/services/movie.service";
import { StorageService } from "src/app/core/services/moviestorage.service";
import { MovieStore } from "src/app/core/stores/movie.store";
import { environment } from "src/environments/environment";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { toSignal } from "@angular/core/rxjs-interop";
import { CommonModule } from "@angular/common";
@Component({
    selector: "app-discover-page",
    templateUrl: "./discover.component.html",
    styleUrls: ["./discover.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule]
})
export class DiscoverComponent implements OnInit{
    private movieService = inject(MovieService);
    private movieStore = inject(MovieStore);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    
    private searchSubject = new Subject<string>();
    searchQuery = this.movieStore.searchQuery;
    selectedGenreIDs = this.movieStore.selectedGenreIDs;
    selectedYear = this.movieStore.selectedYear;
    loading = this.movieStore.loading;
    error = this.movieStore.error;
    filteredDiscoveredMovie = this.movieStore.filteredMovies;
    allGenres = this.movieStore.genres;
    
    minRating = signal<number>(0);

    private debounceSearch = toSignal(
        this.searchSubject.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ),
        {initialValue: ''}
    )
    private cdr = inject(ChangeDetectorRef);
    
    private initialLoad = true;

    constructor() {
        effect(() => {
            const queryParams: Record<string, string | number> = {}
            const search = this.searchQuery();
            if (search) queryParams['search'] = search;
            
            const genres = this.selectedGenreIDs();
            if (genres.length > 0) queryParams['genres'] = genres.join(',');
            
            const year = this.selectedYear();
            if (year) queryParams['year'] = year;
            
            const rating = this.minRating();
            if (rating > 0) queryParams['rating'] = rating;
            (this.router.navigate as any)([], {
                relativeTo: this.route,
                queryParams: queryParams,
                queryParamsHandling: 'merge',
                replaceUrl: true
      });
        });
        effect(() => {
            this.debounceSearch(); 
            this.selectedGenreIDs();
            this.selectedYear();
            this.minRating();
            
            if (!this.initialLoad) {
                this.loadMovies();
            }
        });
    }
     ngOnInit(): void {
    this.loadGenres();
    
    (this.route.queryParams as any).subscribe((params: Record<string, string | undefined>) => {
      if (params['search']) {
        this.movieStore.searchQuery.set(params['search']);
      } else {
        this.movieStore.searchQuery.set('');
      }
      if (params['genres']) {
        const genreIds = params['genres'].split(',').map((id: string) => +id);
        this.movieStore.selectedGenreIDs.set(genreIds);
      } else {
        this.movieStore.selectedGenreIDs.set([]);
      }
      if (params['year']) {
        this.movieStore.selectedYear.set(+params['year']);
      } else {
        this.movieStore.selectedYear.set(null);
      }
      if (params['rating']) {
        this.minRating.set(+params['rating']);
      } else {
        this.minRating.set(0);
      }
    });
    
    setTimeout(() => {
      this.loadMovies();
      setTimeout(() => {
        this.initialLoad = false;
      }, 100);
    }, 0);
  }
    loadMovies() : void {
        this.movieStore.setLoading(true);
        this.movieStore.setError(null);

        const query = (this.debounceSearch() || this.searchQuery()) as string;
        const year = this.selectedYear();
        const genres = this.selectedGenreIDs();
        const rating = this.minRating();

        let request: Observable<any>;
        if (query && query.trim()) {
            request = this.movieService.searchMovie(1, query);
            request.subscribe({
                next: (response: any) => {
                    this.movieStore.setDiscoveredMovie(response.results || []);
                    this.movieStore.setLoading(false);
                    this.cdr.markForCheck();
                },
                error: (err: any) => {
                    this.movieStore.setError('Failed to load movies');
                    this.movieStore.setLoading(false);
                    this.cdr.markForCheck();
                    console.error('Error loading movies:', err);
                }
            });
        } else {
            const discoverParams: Record<string, string | number> = { page: 1 };
            if (genres.length > 0) discoverParams['with_genres'] = genres.join(',');
            if (year) discoverParams['year'] = year;
            if (rating > 0) discoverParams['vote_average_gte'] = rating;
            request = this.movieService.discoverMovie(discoverParams);

            request.subscribe({
                next: (response: any) => {
                    this.movieStore.setDiscoveredMovie(response.results || []);
                    this.movieStore.setLoading(false);
                    this.cdr.markForCheck();
                },
                error: (err: any) => {
                    this.movieStore.setError('Failed to load movies');
                    this.movieStore.setLoading(false);
                    this.cdr.markForCheck();
                    console.error('Error loading movies:', err);
                }
            });
        }
    }
    loadGenres() : void {
        this.movieService.getGenres().subscribe({
      next: (response: any) => {
        this.movieStore.setGenresSignal(response.genres || []);
      },
      error: (err: any) => {
        console.error('Error loading genres:', err);
      }
    });
    }
    onSearchInput(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.movieStore.searchQuery.set(value);
        this.searchSubject.next(value);
    }
    toggleGenre(genreId: number): void {
    const current = this.selectedGenreIDs();
    const updated = current.includes(genreId)
      ? current.filter(id => id !== genreId)
      : [...current, genreId];
    this.movieStore.selectedGenreIDs.set(updated);
    }
    onYearChange(year: number | null): void {
        this.movieStore.selectedYear.set(year);
    }

    onRatingChange(rating: number): void {
        this.minRating.set(rating);
    }

    clearFilters(): void {
        this.movieStore.searchQuery.set('');
        this.movieStore.selectedGenreIDs.set([]);
        this.movieStore.selectedYear.set(null);
        this.minRating.set(0);
        this.searchSubject.next('');
        (this.router.navigate as any)([], {
          relativeTo: this.route,
          replaceUrl: true,
          queryParams: {}
        })
        
    }

    navigateToMovieDetails(movieId: number): void {
        (this.router.navigate as any)(['/movie', movieId]);
    }

    getImageUrl(path: string | null, size: string = 'w300'): string {
        if (!path) {
          return 'https://via.placeholder.com/300x450?text=No+Image'
        }
        return `${environment.tmdbImageBaseUrl}${size}${path}`;
    }

    getYear(dateString: string | null) : string {
        if (!dateString) return 'N/A';
        return new Date(dateString).getFullYear().toString();
    }

    hasActiveFilters(): boolean {
        return !!this.searchQuery() || 
               this.selectedGenreIDs().length > 0 || 
               !!this.selectedYear() || 
               this.minRating() > 0;
    }

    getRatingStars(rating: number): number[] {
        const stars = Math.round(rating / 2); // Convert 10-point scale to 5-star scale
        return Array.from({ length: 5 }, (_, i) => i < stars ? 1 : 0);
    }

    getYearsList(): number[] {
        const currentYear = new Date().getFullYear();
        const years: number[] = [];
        for (let year = currentYear; year >= 1900; year--) {
            years.push(year);
        }
        return years;
    }

    onImageError(event: Event): void {
        const img = event.target as HTMLImageElement;
        if (img) {
            img.src = 'https://via.placeholder.com/300x450?text=No+Image';
        }
    }

    getImageAlt(movieTitle: string): string {
        return `Poster for ${movieTitle}`;
    }
}
