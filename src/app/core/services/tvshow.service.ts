import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { HttpHeaders } from "@angular/common/http";
import { TVShow } from "../models/tvshow.model";
import { map } from "rxjs";
@Injectable({
    providedIn: 'root'
})
export class TVShowService {
    private baseUrl = environment.tmdbBaseUrl;
    private http = inject(HttpClient);

    getPopularTVShow(page : number = 1) : Observable<any> {
        return this.http.get(`${this.baseUrl}/tv/popular`, 
            {
                params: {page}
            }
        );
    }
    getTopRatedTVShows(page: number = 1) : Observable<any> {
        return this.http.get(`${this.baseUrl}/tv/top_rated`, {
            params: {page}
        })
    }
    getOnTheAirTVShows(page: number = 1) : Observable<any> {
        return this.http.get(`${this.baseUrl}/tv/on_the_air`, {
            params: {page}
        })
    } 
     getTVShowsByGenre(genreList: string[], page: number = 1, options?: { year?: number; rating?: number }): Observable<TVShow[]> {
            const params: any = {
                page: page.toString(),
                with_genres: genreList.join(',')
            };
            
            if (options?.year) {
                params['first_air_date_year'] = options.year.toString();
            }
            
            if (options?.rating && options.rating > 0) {
                params['vote_average_gte'] = options.rating.toString();
            }
    
            return this.http.get<any>(`${this.baseUrl}/discover/tv`, { params }).pipe(
                map((response: any) => response.results as TVShow[])
            );
        }
    getTVSimilar(tvId: number) : Observable<any> {
        return this.http.get(`${this.baseUrl}/tv/${tvId}/similar`);
    }
    getTVReviews(tvId: number) : Observable<any> {
        return this.http.get(`${this.baseUrl}/tv/${tvId}/reviews`);
    }
    getGenres(): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${environment.tmdbApiToken}`   
        });
        return this.http.get(`${this.baseUrl}/genre/tv/list`, { headers });
    }
    getTVDetails(tvId: number) : Observable<any> {
        return this.http.get(`${this.baseUrl}/tv/${tvId}`);
    }
    getTVCredits(tvId: number) : Observable<any> {
        return this.http.get(`${this.baseUrl}/tv/${tvId}/credits`);
    }
    
    searchTVShow(page: number = 1, query: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/search/tv`, {
            params: { page, query }
        });
    }
    discoverTVShow(params: {
        page?: number;
        genre?: number[];
        year?: number;
        'vote_average_gte'?: number;
        'first_air_date_year'?: number;
        sort_by?: string
    }) : Observable<any> {
        const requestParams: any = { ...params };
        if (requestParams.year) {
            requestParams.first_air_date_year = requestParams.year;
            delete requestParams.year;
        }
        return this.http.get(`${this.baseUrl}/discover/tv`, {
            params: requestParams
        })
    }
}