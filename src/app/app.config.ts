import { ApplicationConfig } from "@angular/core";
import {provideRouter, withComponentInputBinding} from '@angular/router';
import {HttpClient, provideHttpClient, withInterceptors} from '@angular/common/http';
import {routes} from './app.routes';
import { apiKeyInterceptor } from "./api-key.interceptor";

export const AppConfig : ApplicationConfig = {
    providers: [
        provideRouter(routes, withComponentInputBinding()),
        provideHttpClient(withInterceptors([apiKeyInterceptor]))
    ]
}