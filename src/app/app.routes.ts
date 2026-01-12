import { Routes } from "@angular/router"
export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'

    },
     {
        path: 'home',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'awards',
        loadComponent: () => import('./features/award/award.component').then(m => m.AwardComponent)
    },
    {
        path: 'celebrities',
        loadComponent: () => import('./features/celebrities/celebrities.component').then(m => m.CelebritiesComponent)
    },
    {
        path: 'completed',
        loadComponent: () => import('./features/completed/completed.component').then(m => m.CompletedComponent)
    },
    {
        path: 'discover',
        loadComponent: () => import('./features/discover/discover.component').then(m => m.DiscoverComponent)
    },
    {
        path: 'downloaded',
        loadComponent: () => import('./features/downloaded/downloaded.component').then(m => m.DownloadedComponent)
    },
    {
        path: 'log-out',
        loadComponent: () => import('./features/log-out/log-out.component').then(m => m.LogOutComponent)
    },
    {
        path: 'movie/:id',
        loadComponent: () => import('./features/movie-details/movie-details.component').then(m => m.MovieDetailsComponent)
    },
    {
        path: 'tv/:id',
        loadComponent: () => import('./features/tv-details/tv-details.component').then(m => m.TvDetailsComponent)
    },
    {
        path: 'playlists',
        loadComponent: () => import('./features/playlists/playlists.component').then(m => m.PlaylistsComponent)
    },
    {
        path: 'recent',
        loadComponent: () => import('./features/recent/recent.component').then(m => m.RecentComponent)
    },
    {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
    },
    {
        path: 'top-rated',
        loadComponent: () => import('./features/top-rated/top-rated.component').then(m => m.TopRatedComponent)
    },
    {
        path: 'watchlist',
        loadComponent: () => import('./features/watchlist/watchlist.component').then(m => m.WatchlistComponent)
    },
    {
        path: 'error',
        loadComponent: () => import('./features/error/error.component').then(m => m.ErrorComponent)
    },
    {
        path: '**',
        redirectTo: '/home'
    }
]