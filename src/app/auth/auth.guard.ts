import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import {take, tap} from "rxjs";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isUserAuthenticated.pipe(
    take(1),
    tap(isAuthenticated => {
      if (!isAuthenticated){
        router.navigateByUrl('/log-in');
      }
    }));
}
