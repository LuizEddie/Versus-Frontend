import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  const token = authService.getAcessToken();

  const authRequest = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}`}}) : req;

  return next(authRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if(error.status === 401){
        return authService.refreshToken().pipe(
          switchMap((newToken) => {
            if(newToken){
              const newRequest = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken.Data}`}
              });
              return next(newRequest);
            }
            authService.logout();
            return throwError(() => error);
          }),
          catchError(() => {
            authService.logout();
            return throwError(() => error);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
