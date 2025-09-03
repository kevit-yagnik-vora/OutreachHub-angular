import {
  HttpClient,
  HttpContext,
  HttpContextToken,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TokenStorageService } from './token-storage.service';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { IAuthResponse } from './interfaces/AuthResponse';
import { IUser } from './interfaces/User';

export const NO_AUTH = new HttpContextToken<boolean>(() => false);

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly base = environment.apiUrl; // adjust if needed

  constructor(private http: HttpClient, private store: TokenStorageService) {}

  login(email: string, password: string): Observable<IUser> {
    return this.http
      .post<IAuthResponse>(
        `${this.base}/auth/login`,
        { email, password },
        { context: new HttpContext().set(NO_AUTH, true) }
      )
      .pipe(
        switchMap((res) => {
          // Save tokens
          this.setAccessToken(res.access_token);
          this.setRefreshToken(res.refresh_token);

          // Decode token
          const decoded: any = jwtDecode(res.access_token);
          const userId = decoded?.userId; // <-- backend must embed this

          // Call Nest API to get user
          return this.http.get<IUser>(`${this.base}/user/${userId}`);
        }),
        tap((user: IUser) => {
          this.setUserData(user);
        })
      );
  }

  refresh(): Observable<{ access_token: string }> {
    return this.http
      .post<IAuthResponse>(
        `${this.base}/auth/refresh`,
        { refresh_token: this.getRefreshToken() },
        { context: new HttpContext().set(NO_AUTH, true) }
      )
      .pipe(
        switchMap((res) => {
          // Save new token
          this.setAccessToken(res.access_token);

          // Decode token → extract userId
          const decoded: any = jwtDecode(res.access_token);
          const userId = decoded?.userId;

          // Fetch user by id
          return this.http.get<IUser>(`${this.base}/user/${userId}`).pipe(
            tap((user) => {
              this.setUserData(user); // ✅ update localStorage user
            }),
            map(() => ({ access_token: res.access_token })) // ✅ return token as expected
          );
        })
      );
  }

  logout() {
    const refreshToken = this.store.refreshToken;
    this.http
      .post(`${this.base}/auth/logout`, { refreshToken })
      .subscribe(() => {
        this.store.clear();
        localStorage.removeItem('user');
      });
  }

  getAccessToken(): string | null {
    return this.store.accessToken;
  }
  getRefreshToken(): string | null {
    return this.store.refreshToken;
  }
  setAccessToken(t: string) {
    this.store.accessToken = t;
  }
  setRefreshToken(t: string) {
    this.store.refreshToken = t;
  }
  setUserData(user: IUser) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUserData(): IUser | null {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }
}
