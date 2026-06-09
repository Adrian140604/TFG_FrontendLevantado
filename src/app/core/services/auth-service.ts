import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { JwtPayload, LoginRequest, RegisterRequest, LoginResponse, User, CreateLibrarianRequest } from '../../../interfaces/types';
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

            this._user.set({userId,name,institutionalEmail,role,department,course,enabled: true});
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
        this._user.set({userId,name,institutionalEmail,role,department,course,enabled: true});
      })
    );
  }
  forgotPassword(institutionalEmail: string): Observable<string> {
      console.log('Payload enviado al backend:', { institutionalEmail });

    return this.http.post(`${this.apiUrl}/forgot-password`, { institutionalEmail }, { responseType: 'text' });
  }

  logout(): void {
    localStorage.removeItem('token');
    this._user.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
  canManageBooks(): boolean {
    const role = this._user()?.role;
    return role === 'ADMIN' || role === 'BIBLIOTECARIO';
  }
 canCreateLoans(): boolean {
  const role = this._user()?.role?.trim().toUpperCase();
  return role === 'BIBLIOTECARIO';
}
  isAuthenticated(): boolean {
    return !!this._user();
  }
  canAddBooks(): boolean {
  const role = this._user()?.role;
  return role === 'ADMIN' || role === 'BIBLIOTECARIO';
  }

  canViewAllLoans(): boolean {
    const role = this._user()?.role?.trim().toUpperCase();
    return role === 'ADMIN' || role === 'BIBLIOTECARIO';
  }
  canViewSanctions(): boolean {
    const role = this._user()?.role?.trim().toUpperCase();
    return role === 'ADMIN' || role === 'BIBLIOTECARIO';
  }
  canConfigureSanctions(): boolean {
    const role = this._user()?.role?.trim().toUpperCase();
    return role === 'ADMIN';
  }
  canReserveBooks(): boolean {
    const role = this._user()?.role?.trim().toUpperCase();
    return role === 'USER';
  }
  canViewAllReservations(): boolean {
    const role = this._user()?.role?.trim().toUpperCase();
    return role === 'ADMIN' || role === 'BIBLIOTECARIO';
  }

  
  resetPassword(token: string, newPassword: string, repeatPassword: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/reset-password`, {
      token,
      newPassword,
      repeatPassword
    }, { responseType: 'text' });
  }
  canManageCategories(): boolean {
    const role = this._user()?.role?.trim().toUpperCase();
    return role === 'ADMIN';
  }
  canManageCopies(): boolean {
    const role = this._user()?.role?.trim().toUpperCase();
    return role === 'ADMIN' || role === 'BIBLIOTECARIO';
  }
  createLibrarian(request: CreateLibrarianRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/librarians`, request);
  } 
  canManageLibrarians(): boolean {
    const role = this._user()?.role?.trim().toUpperCase();
    return role === 'ADMIN';
  }
  canManageUsers(): boolean {
    const role = this._user()?.role?.trim().toUpperCase();
    return role === 'ADMIN';
  }
  canViewStats(): boolean {
    const role = this._user()?.role?.trim().toUpperCase();
    return role === 'ADMIN' || role === 'BIBLIOTECARIO';
  }
  canViewAuditLogs(): boolean {
    const role = this._user()?.role?.trim().toUpperCase();
    return role === 'ADMIN';
  }
  canSendReminders(): boolean {
    const role = this._user()?.role?.trim().toUpperCase();
    return role === 'ADMIN' || role === 'BIBLIOTECARIO';
  }
  
}