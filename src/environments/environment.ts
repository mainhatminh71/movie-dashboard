/* import { SecretEnvironment } from "./environment.secret"
 */export const environment = {
    production: true,
    tmdbApiKey: /* SecretEnvironment.tmdbApiKey || */ 'TMDB_API_KEY',
    tmdbBaseUrl: 'https://api.themoviedb.org/3',
    tmdbImageBaseUrl: 'https://image.tmdb.org/t/p/'
}