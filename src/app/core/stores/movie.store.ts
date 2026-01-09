import { Movie } from "../models/movie.model";
import { Injectable, signal, computed, effect } from "@angular/core";
import { StorageService } from "../services/moviestorage.service";
import { WatchListItem } from "../models/watchlistitem.model";

@Injectable({
    providedIn: 'root'
})
export class MovieStore {
    private watchListSignal = signal<WatchListItem[]>([]);
    
    watchList = this.watchListSignal.asReadonly();
    watchListLength = computed(() => this.watchList.length);
    isEmptyWatchList = computed(() => this.watchListLength() === 0);

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