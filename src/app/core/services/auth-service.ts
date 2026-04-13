import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { JwtPayload, LoginRequest, RegisterRequest, LoginResponse, User } from '../../../interfaces/types';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private http: HttpClient = inject(HttpClient);
  private apiUrl = 'https://proyecto2526backend-adrian140604-2.onrender.com/api/auth';

  private _user = signal<User | null>(null);
  user = this._user.asReadonly();

  constructor() {
    const token = localStorage.getItem('token') || '';

    if (token) {
      this.verifyToken(token).subscribe({
        next: () => {
          try {
            const { userId, name, institutionalEmail, role, department, course } =
              jwtDecode<JwtPayload>(token);

            this._user.set({ userId, name, institutionalEmail, role, department, course });
          } catch {
            this.logout();
          }
        },
        error: () => {
          this.logout();
        }
      });
    }
  }

  verifyToken(token: string) {
    const headers: HttpHeaders = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<void>(`${this.apiUrl}/verify`, { headers });
  }

  register(registerRequest: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, registerRequest);
  }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginRequest).pipe(
      tap(response => {
        const { userId, name, institutionalEmail, role, department, course } =
          jwtDecode<JwtPayload>(response.token);

        localStorage.setItem('token', response.token);
        this._user.set({ userId, name, institutionalEmail, role, department, course });
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this._user.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this._user();
  }
}