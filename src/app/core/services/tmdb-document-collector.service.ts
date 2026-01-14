import { MovieService } from "./movie.service";
import { Injectable, inject } from "@angular/core";
import { RAGDocument } from "../models/ragdocument.model";
import { TVShowService } from "./tvshow.service";
import { forkJoin, map, Observable, mergeMap, from, scan, of, toArray, catchError } from "rxjs";
@Injectable({
    providedIn: 'root'
})
export class TmdbDocumentCollectorService {
    private movieService = inject(MovieService);
    private tvShowService = inject(TVShowService);

    private mapMovieToRAGDocument(movie: any, credits: any, keywords: any) : RAGDocument {
        const cast = credits.cast.slice(0, 7).map((c: any) => c.name) || '';
        const keywordsList = keywords.keywords.slice(0, 5).map((k: any) => k.name) || '';
        const genres = movie.genres.map((g: any) => g.name) || '';
        return {
            id: `movie_${movie.id}`,
            type: 'movie',
            title: movie.title,
            year: movie.release_date.split('-')[0],
            overview: movie.overview,
            genres: genres,
            cast: cast,
            keywords: keywordsList,
            poster_path: movie.poster_path,
            embedding: [],
            relevance: 0
        } as RAGDocument;
    }

    createEmbeddingText(document: RAGDocument): string {
        const parts = [
          document.title,
          `Released in ${document.year}`,
          document.overview,
          `Genres: ${document.genres.join(', ')}`,
          document.cast && document.cast.length > 0 ? `Cast: ${document.cast.join(', ')}` : '',
          document.keywords && document.keywords.length > 0 ? `Keywords: ${document.keywords.join(', ')}` : ''
        ].filter(Boolean);
    
        return parts.join('. ');
      }
    

      collectDocumentsBatch(
        movieIds: number[], 
        onProgress?: (current: number, total: number) => void
      ): Observable<RAGDocument[]> {
        if (movieIds.length === 0) {
          return of([]);
        }

        let completedCount = 0;
        const requests = movieIds.map((id, index) => 
          forkJoin({
            movie: this.movieService.getMovieDetails(id),
            credits: this.movieService.getMovieCredits(id),
            keywords: this.movieService.getMovieKeywords(id)
          }).pipe(
            map(({ movie, credits, keywords }) => {
              completedCount++;
              if (onProgress) {
                onProgress(completedCount, movieIds.length);
              }
              try {
                return this.mapMovieToRAGDocument(movie, credits, keywords);
              } catch (error) {
                console.error(`Error mapping movie ${id}:`, error);
                return null;
              }
            })
          )
        );

        return forkJoin(requests).pipe(
          map(docs => docs.filter((doc): doc is RAGDocument => doc !== null))
        );
      } 

      collectPopularMovies(limit: number = 10) : Observable<RAGDocument[]> {
        const pages = Math.ceil(limit / 20);
        const requests = Array.from({ length: pages }, (_, i) => i + 1).map((page) => 
          this.movieService.getPopularMovies(page).pipe(
            mergeMap((movies) => this.collectDocumentsBatch(movies.map((m: any) => m.id)))
          )
        );
        return forkJoin(requests).pipe(
          map(docs => docs.flat()),
          map(docs => docs.filter((doc): doc is RAGDocument => doc !== null))
        );
      }

      collectTopRatedMovies(limit: number = 100): Observable<RAGDocument[]> {
        const pages = Math.ceil(limit / 20);
        const requests = Array.from({ length: pages }, (_, i) => 
          this.movieService.getTopRatedMovies(i + 1)
        );
    
        return forkJoin(requests).pipe(
          map(responses => {
            const movies = responses.flatMap(res => res.results || []);
            return movies.slice(0, limit).map(movie => this.mapMovieToRAGDocument(movie, {}, {}));
          })
        );
      }
      collectMovieDocument(movieId: number): Observable<RAGDocument | null> {
        return forkJoin({
          details: this.movieService.getMovieDetails(movieId),
          credits: this.movieService.getMovieCredits(movieId),
          keywords: this.movieService.getMovieKeywords(movieId)
        }).pipe(
          map(({ details, credits, keywords }) => {
            return this.mapMovieToRAGDocument(details, credits, keywords);
          }),
          catchError(error => {
            console.error(`Error collecting movie ${movieId}:`, error);
            return of(null);
          })
        );
      }

      collectTvShows(tvShowId: number) : Observable<RAGDocument | null> {
        return forkJoin({
            details: this.tvShowService.getTVDetails(tvShowId),
            credits: this.tvShowService.getTVCredits(tvShowId),
            keywords: this.tvShowService.getTVKeywords(tvShowId)
        }).pipe(
            map(({ details, credits, keywords }) => {
                return this.mapMovieToRAGDocument(details, credits, keywords) as RAGDocument;
            }),
            catchError(error => {
                console.error(`Error collecting tv show ${tvShowId}:`, error);
                return of(null);
            })
        );
    }
    
      
}