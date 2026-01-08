export interface TVShow {
    id: number;
    name: string;  
    poster_path: string | null;
    backdrop_path: string | null;
    overview: string;
    first_air_date: string | null;  
    vote_average: number;
    genre_ids?: number[];
}