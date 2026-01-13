import { ChangeDetectionStrategy, Component, Input, OnInit, inject, signal, effect, ChangeDetectorRef, computed } from "@angular/core";
import { MovieService } from "src/app/core/services/movie.service";
import { TVShowService } from "src/app/core/services/tvshow.service";
import { MovieStore } from "src/app/core/stores/movie.store";
import { TVShowStore } from "src/app/core/stores/tvshow.store";
import { Movie } from "src/app/core/models/movie.model";
import { TVShow } from "src/app/core/models/tvshow.model";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { toSignal } from "@angular/core/rxjs-interop";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MovieCardComponent } from "src/app/lib/components/movie-card/movie-card.component";
import { FilterChipComponent } from "src/app/lib/components/filter-chip/filter-chip.component";
import { YearSelectComponent } from "src/app/lib/components/year-select/year-select.component";
import { RatingSliderComponent } from "src/app/lib/components/rating-slider/rating-slider.component";
import { ImageUrlPipe, YearPipe, RatingPipe, TitlePipe } from "src/app/lib/common/pipes";

type ContentType = 'movies' | 'tvshows';

@Component({
    selector: "app-discover-page",
    templateUrl: "./discover.component.html",
    styleUrls: ["./discover.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule, 
        MovieCardComponent, 
        FilterChipComponent, 
        YearSelectComponent, 
        RatingSliderComponent,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule
    ]
})
export class DiscoverComponent implements OnInit{
    private movieService = inject(MovieService);
    private tvShowService = inject(TVShowService);
    private movieStore = inject(MovieStore);
    private tvShowStore = inject(TVShowStore);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private cdr = inject(ChangeDetectorRef);
    
    
    // Active tab state
    activeTab = signal<ContentType>('movies');
    
    // Search debounce
    private searchSubject = new Subject<string>();
    private debounceSearch = toSignal(
        this.searchSubject.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ),
        {initialValue: ''}
    );
    
    // Rating filter
    minRating = signal<number>(0);
    private initialLoad = true;

    // Computed properties based on active tab
    currentStore = computed(() => 
        this.activeTab() === 'movies' ? this.movieStore : this.tvShowStore
    );
    
    searchQuery = computed(() => {
        const store = this.currentStore();
        return store.searchQuery();
    });
    
    selectedGenreIDs = computed(() => {
        const store = this.currentStore();
        return store === this.movieStore 
            ? this.movieStore.selectedGenreIds() 
            : (store as TVShowStore).selectedGenreIds();
    });
    
    selectedYear = computed(() => {
        const store = this.currentStore();
        return store === this.movieStore 
            ? store.selectedYear() 
            : (store as TVShowStore).selectedYear();
    });
    
    loading = computed(() => this.currentStore().loading());
    error = computed(() => {
        const store = this.currentStore();
        const err = store.error();
        return typeof err === 'string' ? err : err;
    });
    
    allGenres = computed(() => {
        const store = this.currentStore();
        return store === this.movieStore
            ? store.genres()
            : (store as TVShowStore).genres();
    });
    
    filteredContent = computed(() => {
        const store = this.currentStore();
        return store === this.movieStore
            ? (store as MovieStore).filteredMovies()
            : (store as TVShowStore).filteredTVShows();
    });
    
    hasActiveFilters = computed(() => {
        return !!this.searchQuery() || 
               this.selectedGenreIDs().length > 0 || 
               !!this.selectedYear() || 
               this.minRating() > 0;
    });

    constructor() {
        // Sync URL params with state
        effect(() => {
            const queryParams: Record<string, string | number> = {};
            
            if (this.activeTab() !== 'movies') {
                queryParams['type'] = this.activeTab();
            }
            
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
        
        // Reload data when filters change
        effect(() => {
            this.debounceSearch(); 
            this.selectedGenreIDs();
            this.selectedYear();
            this.minRating();
            this.activeTab();
            
            if (!this.initialLoad) {
                this.loadContent();
            }
        });
    }
    
    ngOnInit(): void {
        (this.route.queryParams as any).subscribe((params: Record<string, string | undefined>) => {
            // Set active tab first
            if (params['type'] === 'tvshows') {
                this.activeTab.set('tvshows');
            } else {
                this.activeTab.set('movies');
            }
            
            // Get the correct store based on active tab
            const isMovies = this.activeTab() === 'movies';
            const store = isMovies ? this.movieStore : this.tvShowStore;
            
            // Set search query
            if (params['search']) {
                if (isMovies) {
                    this.movieStore.searchQuery.set(params['search']);
                } else {
                    this.tvShowStore.searchQuery.set(params['search']);
                }
            } else {
                if (isMovies) {
                    this.movieStore.searchQuery.set('');
                } else {
                    this.tvShowStore.searchQuery.set('');
                }
            }
            
            // Set genres
            if (params['genres']) {
                const genreIds = params['genres'].split(',').map((id: string) => +id);
                if (isMovies) {
                    this.movieStore.selectedGenreIds.set(genreIds);
                } else {
                    this.tvShowStore.selectedGenreIds.set(genreIds);
                }
            } else {
                if (isMovies) {
                    this.movieStore.selectedGenreIds.set([]);
                } else {
                    this.tvShowStore.selectedGenreIds.set([]);
                }
            }
            
            if (params['year']) {
                const year = +params['year'];
                if (isMovies) {
                    this.movieStore.selectedYear.set(year);
                } else {
                    this.tvShowStore.selectedYear.set(year);
                }
            } else {
                if (isMovies) {
                    this.movieStore.selectedYear.set(null);
                } else {
                    this.tvShowStore.selectedYear.set(null);
                }
            }
            
            // Set rating
            if (params['rating']) {
                this.minRating.set(+params['rating']);
            } else {
                this.minRating.set(0);
            }
        });
        
        this.loadGenres();
        
        setTimeout(() => {
            this.loadContent();
            setTimeout(() => {
                this.initialLoad = false;
            }, 100);
        }, 0);
    }
    
    switchTab(tab: ContentType): void {
        this.activeTab.set(tab);
        this.loadGenres();
        this.loadContent();
    }
    
    loadGenres(): void {
        if (this.activeTab() === 'movies') {
            this.movieService.getGenres().subscribe({
                next: (response: any) => {
                    this.movieStore.setGenres(response.genres || []);
                    this.cdr.markForCheck();
                },
                error: (err: any) => {
                    console.error('Error loading movie genres:', err);
                }
            });
        } else {
            this.tvShowService.getGenres().subscribe({
                next: (response: any) => {
                    this.tvShowStore.setGenres(response.genres || []);
                    this.cdr.markForCheck();
                },
                error: (err: any) => {
                    console.error('Error loading TV show genres:', err);
                }
            });
        }
    }
    
    loadContent(): void {
        if (this.activeTab() === 'movies') {
            this.loadMovies();
        } else {
            this.loadTVShows();
        }
    }
    
    loadMovies(): void {
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
                    this.movieStore.setDiscoveredMovies(response.results || []);
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
        } else if (genres.length > 0) {
            const discoverParams: Record<string, string | number> = { page: 1 };
            discoverParams['with_genres'] = genres.join(',');
            if (year) discoverParams['year'] = year;
            if (rating > 0) discoverParams['vote_average_gte'] = rating;
            request = this.movieService.discoverMovie(discoverParams as any);

            request.subscribe({
                next: (response: any) => {
                    this.movieStore.setDiscoveredMovies(response.results || []);
                    this.movieStore.setLoading(false);
                    this.cdr.markForCheck();
                },
                error: (err: any) => {
                    this.movieStore.setError('Failed to load movies by genre');
                    this.movieStore.setLoading(false);
                    this.cdr.markForCheck();
                    console.error('Error loading movies by genre:', err);
                }
            });
        } else {
            const discoverParams: Record<string, string | number> = { page: 1 };
            if (year) discoverParams['year'] = year;
            if (rating > 0) discoverParams['vote_average_gte'] = rating;
            request = this.movieService.discoverMovie(discoverParams);

            request.subscribe({
                next: (response: any) => {
                    this.movieStore.setDiscoveredMovies(response.results || []);
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
    
    loadTVShows(): void {
        this.tvShowStore.setLoading(true);
        this.tvShowStore.setError('');

        const query = (this.debounceSearch() || this.searchQuery()) as string;
        const year = this.selectedYear();
        const genres = this.selectedGenreIDs();
        const rating = this.minRating();

        let request: Observable<any>;
        if (query && query.trim()) {
            request = this.tvShowService.searchTVShow(1, query);
            request.subscribe({
                next: (response: any) => {
                    this.tvShowStore.setDiscoveredTVShows(response.results || []);
                    this.tvShowStore.setLoading(false);
                    this.cdr.markForCheck();
                },
                error: (err: any) => {
                    this.tvShowStore.setError('Failed to load TV shows');
                    this.tvShowStore.setLoading(false);
                    this.cdr.markForCheck();
                    console.error('Error loading TV shows:', err);
                }
            });
        } else if (genres.length > 0) {
            const discoverParams: Record<string, string | number> = { page: 1 };
            discoverParams['with_genres'] = genres.join(',');
            if (year) discoverParams['first_air_date_year'] = year;
            if (rating > 0) discoverParams['vote_average_gte'] = rating;
            request = this.tvShowService.discoverTVShow(discoverParams as any);

            request.subscribe({
                next: (response: any) => {
                    this.tvShowStore.setDiscoveredTVShows(response.results || []);
                    this.tvShowStore.setLoading(false);
                    this.cdr.markForCheck();
                },
                error: (err: any) => {
                    this.tvShowStore.setError('Failed to load TV shows by genre');
                    this.tvShowStore.setLoading(false);
                    this.cdr.markForCheck();
                    console.error('Error loading TV shows by genre:', err);
                }
            });
        } else {
            const discoverParams: Record<string, string | number> = { page: 1 };
            if (year) discoverParams['first_air_date_year'] = year;
            if (rating > 0) discoverParams['vote_average_gte'] = rating;
            request = this.tvShowService.discoverTVShow(discoverParams);

            request.subscribe({
                next: (response: any) => {
                    this.tvShowStore.setDiscoveredTVShows(response.results || []);
                    this.tvShowStore.setLoading(false);
                    this.cdr.markForCheck();
                },
                error: (err: any) => {
                    this.tvShowStore.setError('Failed to load TV shows');
                    this.tvShowStore.setLoading(false);
                    this.cdr.markForCheck();
                    console.error('Error loading TV shows:', err);
                }
            });
        }
    }
    
    searchFocused = signal<boolean>(false);

    onSearchFocus(): void {
        this.searchFocused.set(true);
    }

    onSearchBlur(): void {
        this.searchFocused.set(false);
    }

    onSearchInput(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        const store = this.currentStore();
        if (store === this.movieStore) {
            (store as MovieStore).searchQuery.set(value);
        } else {
            (store as TVShowStore).searchQuery.set(value);
        }
        this.searchSubject.next(value);
    }
    
    toggleGenre(genreId: number): void {
        const store = this.currentStore();
        if (store === this.movieStore) {
            const current = (store as MovieStore).selectedGenreIds();
            const updated = current.includes(genreId)
                ? current.filter(id => id !== genreId)
                : [...current, genreId];
            (store as MovieStore).selectedGenreIds.set(updated);
        } else {
            const current = (store as TVShowStore).selectedGenreIds();
            const updated = current.includes(genreId)
                ? current.filter(id => id !== genreId)
                : [...current, genreId];
            (store as TVShowStore).selectedGenreIds.set(updated);
        }
    }
    
    onYearChange(year: number | null): void {
        const store = this.currentStore();
        if (store === this.movieStore) {
            (store as MovieStore).selectedYear.set(year);
        } else {
            (store as TVShowStore).selectedYear.set(year);
        }
    }

    onRatingChange(rating: number): void {
        this.minRating.set(rating);
    }

    clearSearch(): void {
        const store = this.currentStore();
        if (store === this.movieStore) {
            (store as MovieStore).searchQuery.set('');
        } else {
            (store as TVShowStore).searchQuery.set('');
        }
        this.searchSubject.next('');
    }

    clearFilters(): void {
        const store = this.currentStore();
        if (store === this.movieStore) {
            (store as MovieStore).searchQuery.set('');
            (store as MovieStore).selectedGenreIds.set([]);
            (store as MovieStore).selectedYear.set(null);
        } else {
            (store as TVShowStore).searchQuery.set('');
            (store as TVShowStore).selectedGenreIds.set([]);
            (store as TVShowStore).selectedYear.set(null);
        }
        this.minRating.set(0);
        this.searchSubject.next('');
        (this.router.navigate as any)([], {
            relativeTo: this.route,
            replaceUrl: true,
            queryParams: {}
        });
    }

    navigateToDetails(id: number): void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const route = this.activeTab() === 'movies' ? '/movie' : '/tv';
        this.router.navigate([route, id], {
            state: { referrer: 'discover' }
        }).then(() => {
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                mainContent.scrollTop = 0;
            }
        });
    }
}
