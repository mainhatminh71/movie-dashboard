import { Routes } from "@angular/router"
export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'

    },
     {
        path: 'home',
        loadComponent: () => import('./export-result/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'awards',
        loadComponent: () => import('./export-result/award/award.component').then(m => m.AwardComponent)
    },
    {
        path: 'celebrities',
        loadComponent: () => import('./export-result/celebrities/celebrities.component').then(m => m.CelebritiesComponent)
    },
    {
        path: 'completed',
        loadComponent: () => import('./export-result/completed/completed.component').then(m => m.CompletedComponent)
    },
    {
        path: 'discover',
        loadComponent: () => import('./export-result/discover/discover.component').then(m => m.DiscoverComponent)
    },
    {
        path: 'downloaded',
        loadComponent: () => import('./export-result/downloaded/downloaded.component').then(m => m.DownloadedComponent)
    },
    {
        path: 'log-out',
        loadComponent: () => import('./export-result/log-out/log-out.component').then(m => m.LogOutComponent)
    },
    {
        path: 'movie/:id',
        loadComponent: () => import('./export-result/movie-details/movie-details.component').then(m => m.MovieDetailsComponent)
    },
    {
        path: 'playlists',
        loadComponent: () => import('./export-result/playlists/playlists.component').then(m => m.PlaylistsComponent)
    },
    {
        path: 'recent',
        loadComponent: () => import('./export-result/recent/recent.component').then(m => m.RecentComponent)
    },
    {
        path: 'settings',
        loadComponent: () => import('./export-result/settings/settings.component').then(m => m.SettingsComponent)
    },
    {
        path: 'top-rated',
        loadComponent: () => import('./export-result/top-rated/top-rated.component').then(m => m.TopRatedComponent)
    },
    {
        path: 'watchlist',
        loadComponent: () => import('./export-result/watchlist/watchlist.component').then(m => m.WatchlistComponent)
    },
    {
        path: '**',
        redirectTo: '/error'
    }
]