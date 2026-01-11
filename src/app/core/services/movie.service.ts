import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { HttpHeaders } from "@angular/common/http";
import { map } from "rxjs";
import { Movie } from "../models/movie.model";

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
    getMoviesByGenre(genreList: string[], page: number = 1, options?: { year?: number; rating?: number }): Observable<Movie[]> {
        const params: any = {
            page: page.toString(),
            with_genres: genreList.join(',')
        };
        
        if (options?.year) {
            params['year'] = options.year.toString();
        }
        
        if (options?.rating && options.rating > 0) {
            params['vote_average_gte'] = options.rating.toString();
        }

        return this.http.get<any>(`${this.baseUrl}/discover/movie`, { params }).pipe(
            map((response: any) => response.results as Movie[])
        );
    }
    getTopRatedMovies(page: number = 1) : Observable<any> {
        return this.http.get(`${this.baseUrl}/movie/top-rated`, {
            params: {page}
        })
    }
    getNowPlayingMovies(page: number = 1) : Observable<any> {
        return this.http.get(`${this.baseUrl}/movie/now_playing`, {
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
        const headers = new HttpHeaders({
    Authorization: `Bearer ${environment.tmdbApiToken}`   
         });
        return this.http.get(`${this.baseUrl}/genre/movie/list`, { headers});
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