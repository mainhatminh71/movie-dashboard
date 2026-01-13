import { environment } from '../../../../environments/environment';

/**
 * Get full TMDB image URL
 * @param path - Image path from TMDB API
 * @param size - Image size (default: 'w300')
 * @returns Full image URL or placeholder if path is null
 */
export function getImageUrl(path: string | null, size: string = 'w300'): string {
  if (!path) {
    return getPlaceholderImage();
  }
  return `${environment.tmdbImageBaseUrl}${size}${path}`;
}

/**
 * Get placeholder image URL
 * @param width - Image width (default: 300)
 * @param height - Image height (default: 450)
 * @param text - Placeholder text (default: 'No Image')
 */
export function getPlaceholderImage(
  width: number = 300,
  height: number = 450,
  text: string = 'No Image'
): string {
  return `https://via.placeholder.com/${width}x${height}?text=${encodeURIComponent(text)}`;
}