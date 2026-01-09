import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  const apiKey = environment.tmdbApiKey;
  const authReq = req.clone({
    setParams: {
      'api_key': apiKey
    }
  })
  return next(authReq);
};
