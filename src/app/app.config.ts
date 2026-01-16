import { ApplicationConfig } from "@angular/core";
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { routes } from './app.routes';
import { apiKeyInterceptor } from "./api-key.interceptor";
import * as AllIcons from '@ant-design/icons-angular/icons';
import { antDesignConfig } from "./core/config/ant-design.config";
import { IconDefinition } from '@ant-design/icons-angular';
import { provideNzConfig } from "ng-zorro-antd/core/config";



const antDesignIcons = AllIcons as { [key: string]: IconDefinition };

export const AppConfig: ApplicationConfig = {
    providers: [
        provideRouter(
            routes,
            withComponentInputBinding(),
            withInMemoryScrolling({
                scrollPositionRestoration: 'top'
            })
        ),
        provideHttpClient(withInterceptors([apiKeyInterceptor])),
        provideAnimations(),
        provideNzIcons(Object.values(antDesignIcons)),
        provideNzConfig(antDesignConfig)
    ]
}