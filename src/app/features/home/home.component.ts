import { Component, OnInit, inject } from '@angular/core';
import { Movie } from 'src/app/core/models/movie.model';
import { TVShow } from 'src/app/core/models/tvshow.model';
import { MovieService } from 'src/app/core/services/movie.service';
import { TVShowService } from 'src/app/core/services/tvshow.service';
@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true
})
export class HomeComponent implements OnInit{
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
}
