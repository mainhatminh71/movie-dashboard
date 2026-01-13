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
        path: 'discover',
        loadComponent: () => import('./features/discover/discover.component').then(m => m.DiscoverComponent)
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