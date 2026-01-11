import { ApplicationConfig } from "@angular/core";
import {provideRouter, withComponentInputBinding, withInMemoryScrolling} from '@angular/router';
import {provideAnimations} from '@angular/platform-browser/animations';
import {HttpClient, provideHttpClient, withInterceptors} from '@angular/common/http';
import {routes} from './app.routes';
import { apiKeyInterceptor } from "./api-key.interceptor";

export const AppConfig : ApplicationConfig = {
    providers: [
        provideRouter(
            routes, 
            withComponentInputBinding(),
            withInMemoryScrolling({
                scrollPositionRestoration: 'top'
            })
        ),
        provideHttpClient(withInterceptors([apiKeyInterceptor])),
        provideAnimations()
    ]
}