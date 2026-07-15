import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withPreloading } from '@angular/router';
import { appRoutes } from './app.routes';
import { FlagPreloadStrategy } from './shared/flag-preload-strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes, withPreloading(FlagPreloadStrategy), withComponentInputBinding()),
  ],
};
