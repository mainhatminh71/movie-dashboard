import { WatchListItem } from '../models/watchlistitem.model';
import { Movie } from '../models/movie.model';
import { Injectable, inject, signal, computed, effect } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { MovieService } from './movie.service';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private readonly document = inject(DOCUMENT);
    private readonly localStorage = this.document.defaultView?.localStorage;
    private readonly WATCHLIST_KEY =  'tmdb_watchlist';
    
    private watchListSignal = signal<WatchListItem[]>([]);
    private watchList = this.watchListSignal.asReadonly();
    count = computed(() => this.watchList().length);

    constructor() {
        this.loadFromStorage();
        effect(() => {
            if (!this.localStorage) return;
            try {
                this.localStorage.setItem(this.WATCHLIST_KEY, JSON.stringify(this.watchListSignal));
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
        if (computed(() => this.watchList().some(m => m.id === movie.id))) return false;
        return true;
    }
    checkMovieById(movieId : number) : boolean {
        if (computed(() => this.watchList().some(m => m.id === movieId))) return false;
        return true;
    }
    addMovie(movie : Movie) : void {
        this.watchListSignal.update(current => {
            if (this.checkMovie(movie)) return current;
            const newMovie : WatchListItem = {
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                release_date: movie.release_date || '',
                addedAt: new Date().toISOString()
            }
            return [...current, newMovie];
        })
    }
    removeMovie(movie: Movie) : void {
        return this.watchListSignal.update(current => {
             return current.filter(m => m.id !== movie.id)
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