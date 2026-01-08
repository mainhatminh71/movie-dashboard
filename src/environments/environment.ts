import { SecretEnvironment } from "./environment.secret"
export const environment = {
    production: false,
    tmdbApiKey: SecretEnvironment.tmdbApiKey,
    tmdbBaseUrl: 'https://api.themoviedb.org/3',
    tmdbImageBaseUrl: 'https://image.tmdb.org/t/p/'
}