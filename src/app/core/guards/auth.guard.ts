import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { isJwtExpired } from '../auth/token.utils';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const accessToken = this.authService.getAccessToken();
    const userData = this.authService.getUserData();

    // Check if user is authenticated and token is not expired
    if (accessToken && userData && !isJwtExpired(accessToken)) {
      return true;
    }

    // Clear invalid/expired tokens
    if (accessToken && isJwtExpired(accessToken)) {
      this.authService.clearSession();
    }

    // Not authenticated, redirect to login
    return this.router.createUrlTree(['/auth/login'], {
      queryParams: { returnUrl: state.url },
    });
  }
}
