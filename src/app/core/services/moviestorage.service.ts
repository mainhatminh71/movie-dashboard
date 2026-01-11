import { WatchListItem } from '../models/watchlistitem.model';
import { Movie } from '../models/movie.model';
import { TVShow } from '../models/tvshow.model';
import { Injectable, inject, signal, computed, effect } from "@angular/core";
import { DOCUMENT } from "@angular/common";

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private readonly document = inject(DOCUMENT);
    private readonly localStorage = this.document.defaultView?.localStorage;
    private readonly WATCHLIST_KEY =  'tmdb_watchlist';
    
    private watchListSignal = signal<WatchListItem[]>([]);
    watchList = this.watchListSignal.asReadonly();
    count = computed(() => this.watchList().length);

    constructor() {
        this.loadFromStorage();
        effect(() => {
            if (!this.localStorage) return;
            try {
                this.localStorage.setItem(this.WATCHLIST_KEY, JSON.stringify(this.watchListSignal()));
            } catch {
                console.log("Effect Storage said: mewmew");
            }
        });
        if (typeof window !== 'undefined') {
            window.addEventListener('storage', (e) => {
                if (e.key === this.WATCHLIST_KEY && e.newValue) {
                    const parsed = JSON.parse(e.newValue);
                    this.watchListSignal.set(parsed);
                }
            })
        }
    }

    getWatchList() : WatchListItem[] {
        if (!this.localStorage) return [];
        try {
            const data = this.localStorage.getItem(this.WATCHLIST_KEY);
            return data ? JSON.parse(data) : [];
        } catch (err) {
            console.log("LocalStorage said: mewmew");
        }
        return [];
    }
    checkMovie(movie : Movie) : boolean {
        return !this.watchList().some(m => m.id === movie.id);
    }
    checkMovieById(movieId : number) : boolean {
        return this.watchList().some(m => m.id === movieId);
    }
    addMovie(movie : Movie) : void {
        this.watchListSignal.update(current => {
            if (!this.checkMovie(movie)) return current;
            const newMovie : WatchListItem = {
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                release_date: movie.release_date || null,
                addedAt: new Date().toISOString(),
                type: 'movie'
            }
            return [...current, newMovie];
        })
    }
    removeMovie(movie: Movie) : void {
        return this.watchListSignal.update(current => {
             return current.filter(m => m.id !== movie.id)
        })
    }
    addTVShow(tvShow: TVShow): void {
        this.watchListSignal.update(current => {
            if (!this.checkTVShow(tvShow)) return current;
            const newTVShow: WatchListItem = {
                id: tvShow.id,
                title: tvShow.name,
                poster_path: tvShow.poster_path,
                release_date: tvShow.first_air_date || null,
                addedAt: new Date().toISOString(),
                type: 'tvshow'
            }
            return [...current, newTVShow];
        })
    }
    removeTVShow(tvShow: TVShow): void {
        return this.watchListSignal.update(current => {
            return current.filter(m => m.id !== tvShow.id)
        })
    }
    checkTVShow(tvShow: TVShow): boolean {
        return !this.watchList().some(m => m.id === tvShow.id);
    }
    checkTVShowById(tvShowId: number): boolean {
        return this.watchList().some(m => m.id === tvShowId);
    }
    checkItemById(itemId: number): boolean {
        return this.watchList().some(m => m.id === itemId);
    }
    removeItemById(itemId: number): void {
        this.watchListSignal.update(current => {
            return current.filter(m => m.id !== itemId)
        })
    }
    clearWatchList(watchList: WatchListItem[]) : void {
        if (!this.localStorage) return;
        this.watchListSignal.set([]);
        this.localStorage.removeItem(this.WATCHLIST_KEY);
    }
    saveWatchList(watchList: WatchListItem[]) : void {
        if (typeof localStorage === 'undefined') return;
        try {
            this.localStorage?.setItem(this.WATCHLIST_KEY, JSON.stringify(watchList));
        } catch (err) {}
    }
    private loadFromStorage() : void {
        if (!this.localStorage) return;
        try {
            const data = this.localStorage.getItem(this.WATCHLIST_KEY);
            if (data) {
                const parsed = JSON.parse(data) as WatchListItem[];
                this.watchListSignal.set(parsed);
            }
            else {
                this.watchListSignal.set([]);
            }
        } catch (err) {
            console.log("Load From Storage said: Mewmew")
        }
    }
        
}