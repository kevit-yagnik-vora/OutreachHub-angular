import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';
import { AuthService, NO_AUTH } from './auth.service';
import { isJwtExpired } from './token.utils';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private refreshInProgress = false;
  private refreshSubject = new BehaviorSubject<string | null>(null);

  constructor(private auth: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Skip auth for NO_AUTH-marked requests (login/refresh)
    if (req.context.get(NO_AUTH)) {
      return next.handle(req);
    }

    const token = this.auth.getAccessToken();

    // If no token, just pass through
    if (!token) {
      return next.handle(req);
    }

    // If token valid → attach and go
    if (!isJwtExpired(token)) {
      return next.handle(this.addAuth(req, token)).pipe(
        // If backend still returns 401, try one controlled refresh
        catchError((err) => this.handleAuthError(err, req, next))
      );
    }

    // Token expired → refresh first, then retry
    return this.refreshAndReplay(req, next);
  }

  private addAuth(req: HttpRequest<any>, token: string) {
    return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  private handleAuthError(
    err: any,
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (err instanceof HttpErrorResponse && err.status === 401) {
      return this.refreshAndReplay(req, next);
    }
    return throwError(() => err);
  }

  private refreshAndReplay(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.refreshInProgress) {
      this.refreshInProgress = true;
      this.refreshSubject.next(null);

      return this.auth.refresh().pipe(
        switchMap((res) => {
          const newToken = res.access_token;
          this.refreshSubject.next(newToken);
          // retry original request with new token
          return next.handle(this.addAuth(req, newToken));
        }),
        catchError((err) => {
          // Refresh failed → hard logout + bubble up
          this.auth.logout();
          return throwError(() => err);
        }),
        finalize(() => {
          this.refreshInProgress = false;
        })
      );
    } else {
      // Wait until refresh completes, then retry with emitted token
      return this.refreshSubject.pipe(
        filter((t): t is string => !!t),
        take(1),
        switchMap((t) => next.handle(this.addAuth(req, t)))
      );
    }
  }
}
