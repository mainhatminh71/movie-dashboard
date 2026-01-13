import { Movie } from "src/app/core/models/movie.model";
import { TVShow } from "src/app/core/models/tvshow.model";

export function getTitle(item: Movie | TVShow): string {
    return 'title' in item ? item.title : item.name;
  }

  export function getReleaseDate(item: Movie | TVShow): string | null {
    return 'release_date' in item ? item.release_date : item.first_air_date;
  }

  export function isMovie(item: Movie | TVShow): item is Movie {
    return 'title' in item;
  }

  export function isTVShow(item: Movie | TVShow): item is TVShow {
    return 'name' in item;
  }

  export function getItemRoute(item: Movie | TVShow): string {
    return isMovie(item) ? '/movie' : '/tv';
  }