import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './shared/interceptors/auth/auth.interceptor';
import { provideSweetAlert2 } from "@sweetalert2/ngx-sweetalert2";
import { AuthService } from './shared/services/auth/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideHttpClient(withInterceptors([authInterceptor])), 
    provideSweetAlert2({fireOnInit: false, dismissOnDestroy: true}),
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return authService.loadUser();
    })
  ]
};
