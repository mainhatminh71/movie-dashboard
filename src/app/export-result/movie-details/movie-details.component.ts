import { Component, inject, signal, OnInit, ChangeDetectorRef } from '@angular/core';
import { MovieService } from 'src/app/core/services/movie.service';
import { MovieStore } from 'src/app/core/stores/movie.store';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css'
})
export class MovieDetailsComponent implements OnInit {
    private movieService = inject(MovieService);
    private movieStore = inject(MovieStore);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private cdr = inject(ChangeDetectorRef);

    movie = signal<any>(null);
    cast = signal<any[]>([]);
    reviews = signal<any[]>([]);
    similarMovies = signal<any[]>([]);
    loading = signal<boolean>(false);
    error = signal<string | null>(null);

    currentMovieId = this.movieStore.currentMovieId;
    currentTitle = this.movieStore.currentTitle;
    currentPoster = this.movieStore.currentPoster;
    currentBackdrop = this.movieStore.currentBackdrop;
    currentOverview = this.movieStore.currentOverview;
    currentReleaseDate = this.movieStore.currentReleaseDate;
    voteAverage = this.movieStore.voteAverage;
    isInWatchlist = signal<boolean>(false);

    ngOnInit(): void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.scrollTop = 0;
        }

        (this.route.params as any).subscribe((params: Record<string, string>) => {
            const id = +params['id'];
            if (id) {
                this.loadMovieData(id);
            }
        });
    }

    loadMovieData(movieId: number): void {
        this.loading.set(true);
        this.error.set(null);
        this.movieStore.setLoading(true);
        this.movieStore.setError(null);

        forkJoin({
            details: this.movieService.getMovieDetails(movieId),
            credits: this.movieService.getMovieCredits(movieId),
            reviews: this.movieService.getMovieReviews(movieId),
            similar: this.movieService.getSimilarMovies(movieId)
        }).subscribe({
            next: (data: any) => {
                const movieDetails = data.details;
                this.movie.set(movieDetails);
                
                this.movieStore.currentMovieId.set(movieId);
                this.movieStore.currentTitle.set(movieDetails.title || null);
                this.movieStore.currentPoster.set(movieDetails.poster_path || null);
                this.movieStore.currentBackdrop.set(movieDetails.backdrop_path || null);
                this.movieStore.currentOverview.set(movieDetails.overview || null);
                this.movieStore.currentReleaseDate.set(movieDetails.release_date || null);
                this.movieStore.voteAverage.set(movieDetails.vote_average || null);
                
                if (movieDetails.genres && movieDetails.genres.length > 0) {
                    const genreIds = movieDetails.genres.map((g: any) => g.id);
                    this.movieStore.currentMovieGenre.set(genreIds[0] || null);
                }

                this.cast.set(data.credits?.cast || []);
                this.reviews.set(data.reviews?.results || []);
                this.similarMovies.set(data.similar?.results || []);
                
                this.isInWatchlist.set(this.movieStore.checkCurrentMovieInWatchList());
                
                this.loading.set(false);
                this.movieStore.setLoading(false);
                this.cdr.markForCheck();
            },
            error: (err: any) => {
                const errorMessage = 'Failed to load movie details';
                this.error.set(errorMessage);
                this.movieStore.setError(errorMessage);
                this.loading.set(false);
                this.movieStore.setLoading(false);
                this.cdr.markForCheck();
                console.error('Error loading movie details:', err);
            }
        });
    }

    toggleWatchlist(): void {
        const movie = this.movie();
        if (movie) {
            this.movieStore.toggleWatchlist(movie);
            this.isInWatchlist.set(this.movieStore.checkCurrentMovieInWatchList());
        }
    }

    getImageUrl(path: string | null, size: string = 'w500'): string {
        if (!path) {
            return 'https://via.placeholder.com/500x750?text=No+Image';
        }
        return `${environment.tmdbImageBaseUrl}${size}${path}`;
    }

    getYear(dateString: string | null): string {
        if (!dateString) return 'N/A';
        return new Date(dateString).getFullYear().toString();
    }

    navigateToMovieDetails(movieId: number): void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.router.navigate(['/movie', movieId]).then(() => {
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                mainContent.scrollTop = 0;
            }
        });
    }

    formatRuntime(minutes: number): string {
        if (!minutes) return 'N/A';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    }

    formatCurrency(amount: number): string {
        if (!amount) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(amount);
    }

    onImageError(event: Event, size: string = '500x750'): void {
        const img = event.target as HTMLImageElement;
        if (img) {
            img.src = `https://via.placeholder.com/${size}?text=No+Image`;
        }
    }

    goBack(): void {
        (this.router.navigate as any)(['/discover']);
    }
}