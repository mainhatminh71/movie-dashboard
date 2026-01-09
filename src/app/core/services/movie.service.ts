import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class MovieService {
    private baseUrl = environment.tmdbBaseUrl;
    private http = inject(HttpClient);
    getAllMovies() : Observable<any> {
        return this.http.get(`${this.baseUrl}/movie`)
    }
    getPopularMovies(page: number = 1) : Observable<any> {
        return this.http.get(`${this.baseUrl}/movie/popular`, {
            params: {page}
        })
    }
    getTopRatedMovies(page: number = 1) : Observable<any> {
        return this.http.get(`${this.baseUrl}/movie/top-rated`, {
            params: {page}
        })
    }
    searchMovie(page: number = 1, query: string) : Observable<any> {
        return this.http.get(`${this.baseUrl}/search/movie`, {
            params: {page, query}
        })
    } 
    discoverMovie(params: {
        page?: number;
        genre?: number[];
        year?: number;
        'vote_average_gte'?: number;
        sort_by?: string
    }) : Observable<any> {
        return this.http.get(`${this.baseUrl}/discover/movie`, {
            params: params as any
        })
    }
    getGenres() : Observable<any> {
        return this.http.get(`${this.baseUrl}/genre/movie/list`);
    }


}