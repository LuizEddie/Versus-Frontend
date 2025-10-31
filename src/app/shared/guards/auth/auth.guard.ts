import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if(auth.isLoggedIn()){
    return of(true);
  }

  router.navigate(['/auth/login']);
  return of(false);
};
