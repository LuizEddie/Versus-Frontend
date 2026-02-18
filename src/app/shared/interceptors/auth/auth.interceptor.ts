import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { catchError, switchMap, tap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const excludeUrl = [
    '/Auth/login',
    '/Auth/refresh',
    '/Auth/logout',
    // '/Users/me'
  ];

  const token = authService.getAcessToken();

  if(!token) excludeUrl.push('/Users/me');

  if (excludeUrl.some(url => req.url.includes(url))) {
    return next(req);
  }


  const authRequest = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
  return next(authRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0) {
        authService.logout().subscribe({
          error: () => {
            authService.removeAccessToken();
          }
        });
        return throwError(() => error);
      }

      if (error.status === 401) {
        return authService.refreshToken().pipe(
          // tap(t => console.log('🟢 refreshToken emitiu:', t)),
          switchMap((newToken) => {
            if (newToken) {
              const newRequest = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` }
              });
              return next(newRequest);
            }
            authService.logout().subscribe({
              error: () => {
                authService.removeAccessToken();
              }
            });
            return throwError(() => error);
          }),
          catchError((err) => {
            authService.logout().subscribe({
              error: () => {
                authService.removeAccessToken();
              }
            });
            return throwError(() => err);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
