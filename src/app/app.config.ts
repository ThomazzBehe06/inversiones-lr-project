import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeEsCo from '@angular/common/locales/es-CO';
import { routes } from './app.routes';

// Formato colombiano ($ 420.000)
registerLocaleData(localeEsCo);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Rutas (al cambiar de pagina vuelve arriba)
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    // Peticiones HTTP (JSON y APIs)
    provideHttpClient(withFetch()),
    // Idioma
    { provide: LOCALE_ID, useValue: 'es-CO' },
  ],
};
