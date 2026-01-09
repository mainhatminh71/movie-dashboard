import { Movie } from "../models/movie.model";
import { Injectable, signal, computed, effect } from "@angular/core";
import { StorageService } from "../services/moviestorage.service";
import { WatchListItem } from "../models/watchlistitem.model";

@Injectable({
    providedIn: 'root'
})
export class MovieStore {
    private watchListSignal = signal<WatchListItem[]>([]);
    private discoveredWatchListSignal = signal<Movie[]>([]);
    private discoveredGenres = signal<any[]>([]);
    private loadingSignal = signal<boolean>(false);
    private errorSignal = signal<string | null>(null);

    filteredMovies = computed(() => {
        let movies = this.discoveredWatchListSignal();
        const query = this.searchQuery().toLowerCase().trim();
        const genreId = this.selectedGenreIDs();
        const year = this.selectedYear();
        if (query) {
            movies = movies.filter(m => m.title.toLowerCase().trim().includes(query))
        }
        if (genreId.length > 0) {
            movies = movies.filter(m => m.genre_ide?.some(id => m.genre_ide?.includes(id)))
        }
        if (year) {
            movies = movies.filter(m => {
                if (!m.release_date) return false;
                const movieYear = new Date(m.release_date).getFullYear();
                return movieYear === year;
            })
        }
        return movies;
    })

    setDiscoveredMovie(movies: Movie[]) : void{
        this.discoveredWatchListSignal.set(movies)
    }
    setGenresSignal(genres: any[]) : void {
        this.discoveredGenres.set(genres);
    }
    setLoading(loading: boolean): void {
        this.loadingSignal.set(loading);
    }
    
    setError(error: string | null): void {
        this.errorSignal.set(error);
    }
    
    watchList = this.watchListSignal.asReadonly();
    watchListLength = computed(() => this.watchList.length);
    isEmptyWatchList = computed(() => this.watchListLength() === 0);

    loading = this.loadingSignal.asReadonly();
    error = this.errorSignal.asReadonly();
    genres = this.discoveredGenres.asReadonly();

    //watchList filter and attribute state
    searchQuery = signal<string>('');
    selectedGenreIDs = signal<number[]>([]);
    selectedYear = signal<number | null>(null);
    currentMovieId = signal< number| null>(null);

    //movie attribute state
    currentTitle = signal<string | null>(null);
    currentPoster = signal< string | null>(null);
    currentBackdrop = signal<string | null>(null);
    currentOverview = signal< string | null>(null);
    currentReleaseDate = signal< string | null>(null);
    voteAverage = signal <number| null>(null);
    currentMovieGenre = signal <number | null>(null);

    
    constructor(private storageService : StorageService) {
        const savedWatchList = storageService.getWatchList();
        this.watchListSignal.set(savedWatchList);
        effect(() => {
            storageService.saveWatchList(this.watchList());
        })
    }
    checkCurrentMovieInWatchList() : boolean{
        const movieId = this.currentMovieId();
        if (!movieId) return false;
        return this.storageService.checkMovieById(movieId);
    }
    toggleWatchlist(movie : Movie) : void {
        if (movie != null) {
            this.storageService.addMovie(movie);
        }
    }
    clearFilter() : void {
        this.searchQuery.set('');
        this.selectedGenreIDs.set([]);
        this.selectedYear.set(null);
        this.currentMovieId.set(null);
    }
    

    
}