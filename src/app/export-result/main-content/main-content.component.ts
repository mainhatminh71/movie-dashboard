import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { MovieService } from 'src/app/core/services/movie.service';
import { TVShowService } from 'src/app/core/services/tvshow.service';
import { Movie } from 'src/app/core/models/movie.model';
import { TVShow } from 'src/app/core/models/tvshow.model';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':increment, :decrement', [
        style({ opacity: 0.5 }),
        animate('500ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1 }))
      ])
    ]),
    trigger('slideIn', [
      transition(':increment, :decrement', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('500ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class MainContentComponent implements OnInit{
  private movieService = inject(MovieService);
  private tvShowService = inject(TVShowService);
  private router = inject(Router);
  
  popularMovies : Movie[] = [];
  featuredMovie : Movie | null = null;
  popularTVShows : TVShow[] = [];
  featuredTVShow : TVShow | null = null;
  topRatedMovies : Movie[] = [];
  topRatedTVShows : TVShow[] = [];
  heroMovies : Movie[] = [];
  heroTVShows : TVShow[] = [];
  currentHeroIndex = 0;
  loading = true;
  error : string | null = null;
  searchQuery = '';
  
  touchStartX = 0;
  touchStartY = 0;
  touchEndX = 0;
  touchEndY = 0;
  isDragging = false;

  currentMoviesPage = 1;
  totalMoviesPages = 1;
  currentTVShowsPage = 1;
  totalTVShowsPages = 1;

  ngOnInit(): void {
     this.loadHeroMovies();
     this.loadHeroTVShows();
     this.loadPopularMovies();
     this.loadPopularTVShows(); 
  }

  loadHeroMovies(): void {
    this.movieService.getNowPlayingMovies(1).subscribe({
      next: (response) => {
        this.heroMovies = (response.results || []).slice(0, 5);
        if (this.heroMovies.length === 0) {
          this.movieService.getTopRatedMovies(1).subscribe({
            next: (topRatedResponse) => {
              this.heroMovies = (topRatedResponse.results || []).slice(0, 5);
            },
            error: () => {
              this.heroMovies = [];
            }
          });
        }
      },
      error: () => {
        // Fallback to top rated on error
        this.movieService.getTopRatedMovies(1).subscribe({
          next: (topRatedResponse) => {
            this.heroMovies = (topRatedResponse.results || []).slice(0, 5);
          },
          error: () => {
            this.heroMovies = [];
          }
        });
      }
    });
  }

  loadHeroTVShows(): void {
    this.tvShowService.getOnTheAirTVShows(1).subscribe({
      next: (response) => {
        this.heroTVShows = (response.results || []).slice(0, 5);
        if (this.heroTVShows.length === 0) {
          this.tvShowService.getTopRatedTVShows(1).subscribe({
            next: (topRatedResponse) => {
              this.heroTVShows = (topRatedResponse.results || []).slice(0, 5);
            },
            error: () => {
              this.heroTVShows = [];
            }
          });
        }
      },
      error: () => {
        // Fallback to top rated on error
        this.tvShowService.getTopRatedTVShows(1).subscribe({
          next: (topRatedResponse) => {
            this.heroTVShows = (topRatedResponse.results || []).slice(0, 5);
          },
          error: () => {
            this.heroTVShows = [];
          }
        });
      }
    });
  }

  getCurrentHeroMovie(): Movie | null {
    return this.heroMovies[this.currentHeroIndex] || null;
  }

  getCurrentHeroTVShow(): TVShow | null {
    return this.heroTVShows[this.currentHeroIndex] || null;
  }

  getHeroItemsCount(): number {
    return this.activeTab === 'movies' ? this.heroMovies.length : this.heroTVShows.length;
  }

  nextHero(): void {
    const count = this.getHeroItemsCount();
    if (count > 0) {
      this.currentHeroIndex = (this.currentHeroIndex + 1) % count;
    }
  }

  prevHero(): void {
    const count = this.getHeroItemsCount();
    if (count > 0) {
      this.currentHeroIndex = (this.currentHeroIndex - 1 + count) % count;
    }
  }

  goToHero(index: number): void {
    const count = this.getHeroItemsCount();
    if (index >= 0 && index < count) {
      this.currentHeroIndex = index;
    }
  }
  loadPopularMovies(page: number = 1): void {
    this.loading = true;
    this.error = null;
    this.currentMoviesPage = page;
    this.movieService.getPopularMovies(page).subscribe({
      next: (response) => {
        this.popularMovies = response.results || [];
        this.totalMoviesPages = response.total_pages || 1;
        if (this.popularMovies.length > 0) {
          this.featuredMovie = this.popularMovies[0];
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load movies';
        this.loading = false;
      }
    })
  }
  
  loadPopularTVShows(page: number = 1): void {
    this.loading = true;
    this.error = null;
    this.currentTVShowsPage = page;
    this.tvShowService.getPopularTVShow(page).subscribe({
      next: (response) => {
        this.popularTVShows = response.results || [];
        this.totalTVShowsPages = response.total_pages || 1;
        if (this.popularTVShows.length > 0) {
          this.featuredTVShow = this.popularTVShows[0];
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load TV shows';
        this.loading = false;
      }
    })
  }
  
  activeTab: 'movies' | 'tvshows' | 'anime' = 'tvshows';
  switchTab(tab: 'movies' | 'tvshows' ) : void {
    this.activeTab = tab;
    this.currentHeroIndex = 0; // Reset hero index when switching tabs
    if (tab === 'movies') {
      if (this.heroMovies.length === 0) {
        this.loadHeroMovies();
      }
    } else {
      if (this.heroTVShows.length === 0) {
        this.loadHeroTVShows();
      }
    }
  }

  goToMoviesPage(page: number): void {
    if (page >= 1 && page <= this.totalMoviesPages) {
      this.loadPopularMovies(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goToTVShowsPage(page: number): void {
    if (page >= 1 && page <= this.totalTVShowsPages) {
      this.loadPopularTVShows(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  getImageUrl(path: string | null, size: string = 'w300'): string {
    if (!path) {
      return 'https://via.placeholder.com/300x450?text=No+Image'
    }
    return `${environment.tmdbImageBaseUrl}${size}${path}`;
  }
  getYear(dateString: string | null) : string {
    if (!dateString) return 'N/A';
    return new Date(dateString).getFullYear().toString();
  }

  getPagesArray(totalPages: number): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    const currentPage = this.activeTab === 'movies' ? this.currentMoviesPage : this.currentTVShowsPage;
    
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  navigateToMovieDetails(movieId: number): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.router.navigate(['/movie', movieId], {
      state: { referrer: 'home' }
    }).then(() => {
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.scrollTop = 0;
      }
    });
  }

  navigateToTVDetails(tvId: number): void {
    if (!tvId) {
      console.error('TV ID is required');
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.router.navigate(['/tv', tvId], {
      state: { referrer: 'home' }
    }).then((success) => {
      if (success) {
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
          mainContent.scrollTop = 0;
        }
      } else {
        console.error('Navigation failed');
      }
    }).catch((error) => {
      console.error('Navigation error:', error);
    });
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'https://via.placeholder.com/500x750?text=No+Image';
    }
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
  }

  onSearchKeyDown(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter' && this.searchQuery.trim()) {
      this.navigateToSearch();
    }
  }

  navigateToSearch(): void {
    if (!this.searchQuery.trim()) return;
    
    const tab = this.activeTab;
    this.router.navigate(['/discover'], {
      queryParams: {
        type: tab === 'movies' ? undefined : tab,
        search: this.searchQuery.trim()
      }
    });
  }

  // Touch event handlers for swipe
  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
    this.isDragging = true;
  }

  onTouchMove(event: TouchEvent): void {
    if (!this.isDragging) return;
    event.preventDefault(); // Prevent scrolling while swiping
  }

  onTouchEnd(event: TouchEvent): void {
    if (!this.isDragging) return;
    this.touchEndX = event.changedTouches[0].clientX;
    this.touchEndY = event.changedTouches[0].clientY;
    this.handleSwipe();
    this.isDragging = false;
  }

  // Mouse event handlers for desktop drag
  onMouseDown(event: MouseEvent): void {
    this.touchStartX = event.clientX;
    this.touchStartY = event.clientY;
    this.isDragging = true;
    event.preventDefault();
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;
    event.preventDefault();
  }

  onMouseUp(event: MouseEvent): void {
    if (!this.isDragging) return;
    this.touchEndX = event.clientX;
    this.touchEndY = event.clientY;
    this.handleSwipe();
    this.isDragging = false;
  }

  onMouseLeave(): void {
    if (this.isDragging) {
      this.isDragging = false;
    }
  }

  handleSwipe(): void {
    const deltaX = this.touchEndX - this.touchStartX;
    const deltaY = this.touchEndY - this.touchStartY;
    const minSwipeDistance = 50; // Minimum distance to trigger swipe

    // Check if horizontal swipe is greater than vertical swipe
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        // Swipe right - go to previous
        this.prevHero();
      } else {
        // Swipe left - go to next
        this.nextHero();
      }
    }
  }
}

