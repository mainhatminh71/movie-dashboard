import { Movie } from "../models/movie.model";
import { Injectable, signal, computed, inject } from "@angular/core";
import { StorageService } from "../services/moviestorage.service";

@Injectable({
    providedIn: 'root'
})
export class MovieStore {
    private storageService = inject(StorageService);
    
    private discoveredMoviesSignal = signal<Movie[]>([]);
    private genresSignal = signal<any[]>([]);
    private loadingSignal = signal<boolean>(false);
    private errorSignal = signal<string | null>(null);
    
    searchQuery = signal<string>('');
    selectedGenreIds = signal<number[]>([]);
    selectedYear = signal<number | null>(null);
    minRating = signal<number>(0);
    
    currentMovieId = signal<number | null>(null);
    currentTitle = signal<string | null>(null);
    currentPoster = signal<string | null>(null);
    currentBackdrop = signal<string | null>(null);
    currentOverview = signal<string | null>(null);
    currentReleaseDate = signal<string | null>(null);
    voteAverage = signal<number | null>(null);
    currentGenreId = signal<number | null>(null);
    currentPopularMovies = signal<Movie[] | null>(null);
    
    discoveredMovies = this.discoveredMoviesSignal.asReadonly();
    genres = this.genresSignal.asReadonly();
    loading = this.loadingSignal.asReadonly();
    error = this.errorSignal.asReadonly();
    
    filteredMovies = computed(() => {
        let movies = this.discoveredMoviesSignal();
        const query = this.searchQuery().toLowerCase().trim();
        
        if (query) {
            movies = movies.filter(m => 
                m.title.toLowerCase().trim().includes(query)
            );
        }
        
        if (this.minRating() > 0) {
            movies = movies.filter(m => 
                (m.vote_average || 0) >= this.minRating()
            );
        }
        
        return movies;
    });
    
    hasActiveFilters = computed(() => {
        return !!this.searchQuery() || 
               this.selectedGenreIds().length > 0 || 
               !!this.selectedYear() || 
               this.minRating() > 0;
    });
    
    watchList = this.storageService.watchList;
    watchListCount = this.storageService.count;
    
    setDiscoveredMovies(movies: Movie[]): void {
        this.discoveredMoviesSignal.set(movies);
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
    
    isInWatchlist(movieId: number): boolean {
        return this.storageService.checkMovieById(movieId);
    }
    
    toggleWatchlist(movie: Movie): void {
        if (this.storageService.checkMovieById(movie.id)) {
            this.storageService.removeMovie(movie);
        } else {
            this.storageService.addMovie(movie);
        }
    }
}