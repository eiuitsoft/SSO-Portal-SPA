import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { LoadingInterceptor } from './core/interceptors/loading.interceptor';
import { ApiInterceptor } from './core/interceptors/api.interceptor';
import { KeycloakService } from 'keycloak-angular';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }, // Đặt trước ApiInterceptor
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
  ],
};

const AUTH_KEYCLOAK_URL = environment.KEYCLOAK.authority;
const REALM = environment.KEYCLOAK.realm;
const CLIENT_ID = environment.KEYCLOAK.clientId;

export function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        realm: REALM,
        url: AUTH_KEYCLOAK_URL, // Url server keycloak
        clientId: CLIENT_ID, // Client ID
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
      },
      enableBearerInterceptor: true,
      bearerPrefix: 'Bearer',
    });
}
