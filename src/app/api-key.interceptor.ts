import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  const apiKey = environment.tmdbApiKey;
  const authReq = req.clone({
    setHeaders: {
      'api_key': apiKey
    }
  })
  return next(req);
};
