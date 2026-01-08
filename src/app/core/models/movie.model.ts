export interface Movie {
    id: number,
    title: string,
    poster_path: string | null,
    backdrop_path: string | null,
    overview: string,
    release_date: string | null,
    vote_average: number,
    genre_ide?: number[]
}