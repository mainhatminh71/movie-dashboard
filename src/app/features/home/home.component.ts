import { Component, OnInit, inject } from '@angular/core';
import { Movie } from 'src/app/core/models/movie.model';
import { TVShow } from 'src/app/core/models/tvshow.model';
import { MovieService } from 'src/app/core/services/movie.service';
import { TVShowService } from 'src/app/core/services/tvshow.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCardModule } from 'ng-zorro-antd/card';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-home',
  imports: [NzButtonModule, NzIconModule, NzTabsModule, NzInputModule, NzSpinModule, NzCardModule, FormsModule],
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
