import { Movie } from "../models/movie.model";
import { Injectable, signal, computed, effect } from "@angular/core";
import { StorageService } from "../services/moviestorage.service";
import { WatchListItem } from "../models/watchlistitem.model";
import { MovieService } from "../services/movie.service";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
@Injectable({
    providedIn: 'root'
})
export class MovieStore {
    private discoveredWatchListSignal = signal<Movie[]>([]);
    private discoveredGenres = signal<any[]>([]);
    private loadingSignal = signal<boolean>(false);
    private errorSignal = signal<string | null>(null);

    filteredMovies = computed(() => {
        let movies = this.discoveredWatchListSignal();
        const query = this.searchQuery().toLowerCase().trim();
        
        if (query) {
            movies = movies.filter(m => m.title.toLowerCase().trim().includes(query))
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
    
    watchList = this.storageService.watchList;
    watchListLength = computed(() => this.watchList().length);

    loading = this.loadingSignal.asReadonly();
    error = this.errorSignal.asReadonly();
    genres = this.discoveredGenres.asReadonly();

    //watchList filter and attribute state
    searchQuery = signal<string>('');
    selectedGenreIDs = signal<number[]>([]);
    selectedYear = signal<number | null>(null);
    currentMovieId = signal< number| null>(null);
    currentGenreListSignal = signal<string[] | null>(null);

    currentGenreList = computed(() => this.currentGenreListSignal() ?? []);

    //movie attribute state
    currentTitle = signal<string | null>(null);
    currentPoster = signal< string | null>(null);
    currentBackdrop = signal<string | null>(null);
    currentOverview = signal< string | null>(null);
    currentReleaseDate = signal< string | null>(null);
    voteAverage = signal <number| null>(null);
    currentMovieGenre = signal <number | null>(null);
    currentPopularMovieList = signal<Movie[] | null> (null);
    
    constructor(private storageService : StorageService) {
    }
    checkCurrentMovieInWatchList() : boolean{
        const movieId = this.currentMovieId();
        if (!movieId) return false;
        return this.storageService.checkMovieById(movieId);
    }
    toggleWatchlist(movie : Movie) : void {
        if (movie != null) {
            if (this.storageService.checkMovieById(movie.id)) {
                this.storageService.removeMovie(movie);
            } else {
                this.storageService.addMovie(movie);
            }
        }
    }
    takeMovieListByGenreId(movieService: MovieService, genreIds: number[], options?: { year?: number; rating?: number }): Observable<Movie[]> {
        if (genreIds.length === 0) {
            return of([]);
        }
        const genreList = genreIds.map(id => id.toString());
        return movieService.getMoviesByGenre(genreList, 1, options);
    }
    clearFilter() : void {
        this.searchQuery.set('');
        this.selectedGenreIDs.set([]);
        this.selectedYear.set(null);
        this.currentMovieId.set(null);
    }
    

    
}