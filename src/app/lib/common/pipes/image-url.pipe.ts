import { Pipe, PipeTransform } from '@angular/core';
import { getImageUrl } from '../utils/image.util';

@Pipe({
  name: 'imageUrl',
  standalone: true
})
export class ImageUrlPipe implements PipeTransform {
  transform(path: string | null | undefined, size: string = 'w300'): string {
    return getImageUrl(path ?? '', size);
  }
}