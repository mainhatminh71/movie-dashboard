import { Injectable, signal, computed, inject } from "@angular/core";
import { TVShow } from "../models/tvshow.model";
import { StorageService } from "../services/moviestorage.service";

@Injectable({
    providedIn: 'root'
})
export class TVShowStore {
    private storageService = inject(StorageService);
    
    private discoveredTVShowsSignal = signal<TVShow[]>([]);
    private genresSignal = signal<any[]>([]);
    private loadingSignal = signal<boolean>(false);
    private errorSignal = signal<string | null>(null);
    
    searchQuery = signal<string>('');
    selectedGenreIds = signal<number[]>([]);
    selectedYear = signal<number | null>(null);
    minRating = signal<number>(0);
    
    currentTVShowId = signal<number | null>(null);
    currentName = signal<string>('');
    posterPath = signal<string | null>(null);
    backdropPath = signal<string | null>(null);
    overview = signal<string>('');
    firstAirDate = signal<string | null>(null);
    voteAverage = signal<number>(0);
    genreIds = signal<number[]>([]);
    
    discoveredTVShows = this.discoveredTVShowsSignal.asReadonly();
    genres = this.genresSignal.asReadonly();
    loading = this.loadingSignal.asReadonly();
    error = this.errorSignal.asReadonly();
    
    filteredTVShows = computed(() => {
        let tvShows = this.discoveredTVShowsSignal();
        const query = this.searchQuery().toLowerCase().trim();
        
        if (query) {
            tvShows = tvShows.filter(t => 
                t.name.toLowerCase().includes(query)
            );
        }
        
        if (this.minRating() > 0) {
            tvShows = tvShows.filter(t => 
                (t.vote_average || 0) >= this.minRating()
            );
        }
        
        return tvShows;
    });
    
    hasActiveFilters = computed(() => {
        return !!this.searchQuery() || 
               this.selectedGenreIds().length > 0 || 
               !!this.selectedYear() || 
               this.minRating() > 0;
    });
    
    watchList = this.storageService.watchList;
    watchListCount = this.storageService.count;
    
    setDiscoveredTVShows(tvShows: TVShow[]): void {
        this.discoveredTVShowsSignal.set(tvShows);
    }
    
    setGenres(genres: any[]): void {
        this.genresSignal.set(genres);
    }
    
    setLoading(loading: boolean): void {
        this.loadingSignal.set(loading);
    }
    
    setError(error: string | null): void {
        this.errorSignal.set(error);
    }
    
    clearFilters(): void {
        this.searchQuery.set('');
        this.selectedGenreIds.set([]);
        this.selectedYear.set(null);
        this.minRating.set(0);
    }
    
    isInWatchlist(tvShowId: number): boolean {
        return this.storageService.checkTVShowById(tvShowId);
    }
    
    toggleWatchlist(tvShow: TVShow): void {
        if (this.storageService.checkTVShowById(tvShow.id)) {
            this.storageService.removeTVShow(tvShow);
        } else {
            this.storageService.addTVShow(tvShow);
        }
    }
}