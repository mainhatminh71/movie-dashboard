import { Movie } from './../models/movie.model';
import { WatchlistComponent } from './../../export-result/watchlist/watchlist.component';
import { Injectable, inject } from "@angular/core";
import { environment } from "src/environments/environment";
import { WatchListItem } from "../models/watchlistitem.model";
import { DOCUMENT } from "@angular/common";

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private readonly document = inject(DOCUMENT);
    private readonly localStorage = this.document.defaultView?.localStorage;
    private readonly WATCHLIST_KEY =  'tmdb_watchlist';
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
        const watchList = this.getWatchList();
        if (watchList.some(m => movie.id === m.id)) return false;
        return true;
    }
    addMovie(movie : Movie) : void {
        const watchList = this.getWatchList();
        if (!this.localStorage) return;
        if (!this.checkMovie(movie)) return;
        const newItem : WatchListItem = {
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.release_date || '',
            addedAt: new Date().toISOString()
        }
        watchList.push(newItem);
        this.saveWatchList(watchList);
    }
    removeMovie(movie: Movie) : void {
        if (!this.localStorage) return;
        const watchList = this.getWatchList();
        watchList.filter(m => movie.id !== m.id);
        this.saveWatchList(watchList);
    }
    saveWatchList(watchList: WatchListItem[]) : void {
        if (!this.localStorage) return;
        try {
            this.localStorage.setItem(this.WATCHLIST_KEY, JSON.stringify(watchList));
        } catch (err) {
            console.log("Save mewmew")
        }
    }
    clearWatchList(watchList: WatchListItem[]) : void {
        if (!this.localStorage) return;
        this.localStorage.removeItem(this.WATCHLIST_KEY);
    }
        
}