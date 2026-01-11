import { MovieService } from 'src/app/core/services/movie.service';
import { Injectable, signal, computed } from "@angular/core";
import { TVShow } from "../models/tvshow.model";
import { WatchListItem } from "../models/watchlistitem.model";
import { Observable } from 'rxjs';
import { TVShowService } from '../services/tvshow.service';
import { of } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class TVShowStore {
    private tvShowSignalList = signal<WatchListItem[] | null> (null);
    private discoveredTVShowSignalList = signal<TVShow[]>([]);
    private discoveredTVShowGenreIdSignal = signal<any[]>([]);
    private loadingSignal = signal<boolean>(false);
    private errorSignal = signal<string | null>(null);
    

    searchQuery = signal<string>('');
    selectedGenreIds = signal<number[]>([]);
    selectedYear = signal<number|null>(null);
    currentTVShowId = signal<number|null>(null);


    discoverdTVShows = this.discoveredTVShowSignalList.asReadonly();
    discoveredTVShowGenreId = this.discoveredTVShowGenreIdSignal.asReadonly();
    loading = this.loadingSignal.asReadonly();
    error = this.errorSignal.asReadonly();

    //attribute state
    currentName = signal<string>('');
    poster_path = signal<string|null>(null);
    backdrop_path = signal< string| null>(null);
    overview = signal<string>('');
    first_air_date = signal<string|null>(null);
    vote_average = signal<number>(0);
    genre_id_list = signal<number[]>([]);


    filteredTVShow = computed(() => {
        let tvshows = this.discoveredTVShowSignalList();
        const query = this.searchQuery().toLowerCase().trim();
        if (query) {
            tvshows = tvshows?.filter(t => t.name.includes(query))
        }
        return tvshows;
    })
    takeTVShowListByGenreId(tvShowService: TVShowService, genreIds: number[], options?: { year?: number; rating?: number }): Observable<TVShow[]> {
            if (genreIds.length === 0) {
                return of([]);
            }
            const genreList = genreIds.map(id => id.toString());
            return tvShowService.getTVShowsByGenre(genreList, 1, options);
        }
    setDiscoveredTVShowSignal(tvShowList : TVShow[]) : void {
        this.discoveredTVShowSignalList.set(tvShowList);
    }
    setGenreIDSignal(genreIdList : any[]) : void {
        this.discoveredTVShowGenreIdSignal.set(genreIdList);
    }
    setLoading(loadingStatus: boolean) : void {
        this.loadingSignal.set(loadingStatus);
    }
    setError(errorStatus: string | null) : void {
        this.errorSignal.set(errorStatus);
    }
    clearFilter() : void {
        this.searchQuery.set('');
        this.selectedGenreIds.set([]);
        this.selectedYear.set(null);
        this.currentTVShowId.set(null);
    }
}