export interface WatchListItem {
    id: number,
    title: string,
    poster_path: string | null,
    release_date: string | null,
    addedAt: string,
    type?: 'movie' | 'tvshow'
}