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

    //Movie details
    getMovieDetails(movieId: number) : Observable<any> {
        return this.http.get(`${this.baseUrl}/movie/${movieId}`);
    }
    getMovieCredits(movieId: number) : Observable<any> {
        return this.http.get(`${this.baseUrl}/movie/${movieId}/credits`);
    }
    getMovieReviews(movieId: number) : Observable<any> {
        return this.http.get(`${this.baseUrl}/movie/${movieId}/reviews`);
    }
    getMovieRecommendations(movieId: number) : Observable<any> {
        return this.http.get(`${this.baseUrl}/movie/${movieId}/recommendations`);
    }
    getMovieSimilar(movieId: number) : Observable<any> {
        return this.http.get(`${this.baseUrl}/movie/${movieId}/similar`);
    }
    getMovieVideos(movieId: number) : Observable<any> {
        return this.http.get(`${this.baseUrl}/movie/${movieId}/videos`);
    }
    getMovieImages(movieId: number) : Observable<any> {
        return this.http.get(`${this.baseUrl}/movie/${movieId}/images`);
    }
    getMovieKeywords(movieId: number) : Observable<any> {
        return this.http.get(`${this.baseUrl}/movie/${movieId}/keywords`);
    }
    getMovieReleaseDates(movieId: number) : Observable<any> {
        return this.http.get(`${this.baseUrl}/movie/${movieId}/release_dates`);
    }
    getMovieExternalIds(movieId: number) : Observable<any> {
        return this.http.get(`${this.baseUrl}/movie/${movieId}/external_ids`);
    }
    getMovieAlternativeTitles(movieId: number) : Observable<any> {
        return this.http.get(`${this.baseUrl}/movie/${movieId}/alternative_titles`);
    }
    getMovieTranslations(movieId: number) : Observable<any> {
        return this.http.get(`${this.baseUrl}/movie/${movieId}/translations`);
    }
    getSimilarMovies(movieId: number) : Observable<any> {
        return this.http.get(`${this.baseUrl}/movie/${movieId}/similar`);
    }



}