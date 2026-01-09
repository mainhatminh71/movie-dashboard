import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit{
  private movieService = inject(MovieService);
  private tvShowService = inject(TVShowService);
  
  popularMovies : Movie[] = [];
  featuredMovie : Movie | null = null;
  popularTVShows : TVShow[] = [];
  featuredTVShow : TVShow | null = null;
  topRatedMovies : Movie[] = [];
  topRatedTVShows : TVShow[] = [];
  loading = true;
  error : string | null = null;


  ngOnInit(): void {
     this.loadPopularMovies();
     this.loadPopularTVShows(); 
  }
  loadPopularMovies(): void {
    this.loading = true;
    this.error = null;
    this.movieService.getPopularMovies(1).subscribe({
      next: (response) => {
        this.popularMovies = response.results || [];
        if (this.popularMovies.length > 0) {
          this.featuredMovie = this.popularMovies[0];
        }
        this.loading = false;
      }
    })
  }
  
  loadPopularTVShows(): void {
    this.loading = true;
    this.error = null;
    this.tvShowService.getPopularTVShow(1).subscribe({
      next: (response) => {
        this.popularTVShows = response.results || [];
        if (this.popularTVShows.length > 0) {
          this.featuredTVShow = this.popularTVShows[0];
        }
      }
    })
  }
  
  activeTab: 'movies' | 'tvshows' | 'anime' = 'tvshows';
  switchTab(tab: 'movies' | 'tvshows' ) : void {
    this.activeTab = tab;
    if (tab === 'tvshows') {

    }
  }
  getImageUrl(path: string | null, size: string = 'w300'): string {
    if (!path) {
      return 'https://via.placeholder.com/300x450?text=No+Image'
    }
    return `${environment.tmdbBaseUrl}${size}${path}`;
  }
  getYear(dateString: string | null) : string {
    if (!dateString) return 'N/A';
    return new Date(dateString).getFullYear().toString();
  }
}

