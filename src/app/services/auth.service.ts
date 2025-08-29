import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}
  apiurl = environment.apiUrl;
  login(email: string, password: string) {
    return this.http.post(this.apiurl + '/auth/login', { email, password });
  }
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }
  logout() {
    localStorage.removeItem('token');
  }

  get isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
