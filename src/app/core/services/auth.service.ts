import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import {
  User,
  SignInCredentials,
  SignUpData,
  AuthResponse,
} from '../../shared/models/user';
import { UserRole } from '../models/admin.model';
import { PERMISSIONS } from '../permissions/permissions';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly STORAGE_KEY = 'auth_user';
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private http = inject(HttpClient);

  private currentUserSubject = new BehaviorSubject<User | null>(
    this.loadUserFromStorage()
  );

  currentUser$ = this.currentUserSubject.asObservable();
  isAuthenticated$ = this.currentUser$.pipe(map((user) => !!user));

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  hasRole(role: UserRole): boolean {
    return this.currentUser?.role === role;
  }

  hasPermission(permission: string): boolean {
    const role = this.currentUser?.role;
    return role ? PERMISSIONS[role].includes(permission) : false;
  }

  getToken(): string | null {
    return this.currentUser?.token || null;
  }

  signIn(credentials: SignInCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      map((response) => this.normalizeAuthResponse(response)),
      tap((response) => this.storeAuthenticatedUser(response)),
      catchError(() =>
        of({
          success: false,
          message: 'Invalid email or password. Please try again.',
        })
      )
    );
  }

  signUp(data: SignUpData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      map((response) => this.normalizeAuthResponse(response)),
      tap((response) => this.storeAuthenticatedUser(response)),
      catchError(() =>
        of({
          success: false,
          message: 'An account with this email already exists.',
        })
      )
    );
  }

  signOut(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private loadUserFromStorage(): User | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const user = JSON.parse(stored);
        return {
          ...user,
          createdAt: new Date(user.createdAt),
          role: user.role || 'USER',
          active: user.active !== false,
        };
      }
    } catch {
      localStorage.removeItem(this.STORAGE_KEY);
    }
    return null;
  }

  private normalizeAuthResponse(response: AuthResponse): AuthResponse {
    if (!response.success || !response.user) {
      return response;
    }

    return {
      ...response,
      user: {
        ...response.user,
        id: String(response.user.id),
        createdAt: new Date(response.user.createdAt),
        token: (response as AuthResponse & { token?: string }).token || response.user.token,
      },
    };
  }

  private storeAuthenticatedUser(response: AuthResponse): void {
    if (!response.success || !response.user) {
      return;
    }

    this.currentUserSubject.next(response.user);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(response.user));
  }
}
