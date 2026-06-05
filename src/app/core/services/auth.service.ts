import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, delay, map } from 'rxjs';
import {
  User,
  SignInCredentials,
  SignUpData,
  AuthResponse,
} from '../../shared/models/user';
import { UserRole } from '../models/admin.model';
import { PERMISSIONS } from '../permissions/permissions';

interface RegisteredUser {
  id: string;
  email: string;
  name: string;
  password: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly STORAGE_KEY = 'auth_user';
  private readonly USERS_KEY = 'registered_users';

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
    // Simulate API call with delay
    return of(this.performSignIn(credentials)).pipe(delay(800));
  }

  signUp(data: SignUpData): Observable<AuthResponse> {
    // Simulate API call with delay
    return of(this.performSignUp(data)).pipe(delay(1000));
  }

  signOut(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private performSignIn(credentials: SignInCredentials): AuthResponse {
    const users = this.getRegisteredUsers();
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === credentials.email.toLowerCase() &&
        u.password === credentials.password
    );

    if (user) {
      if (!user.active) {
        return {
          success: false,
          message: 'This account is disabled. Please contact an administrator.',
        };
      }

      const authenticatedUser: User = {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: new Date(user.createdAt),
        role: user.role,
        active: user.active,
        token: this.generateToken(user),
      };

      this.currentUserSubject.next(authenticatedUser);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(authenticatedUser));

      return {
        success: true,
        message: 'Successfully signed in!',
        user: authenticatedUser,
      };
    }

    return {
      success: false,
      message: 'Invalid email or password. Please try again.',
    };
  }

  private performSignUp(data: SignUpData): AuthResponse {
    const users = this.getRegisteredUsers();

    // Check if email already exists
    const existingUser = users.find(
      (u) => u.email.toLowerCase() === data.email.toLowerCase()
    );

    if (existingUser) {
      return {
        success: false,
        message: 'An account with this email already exists.',
      };
    }

    // Create new user
    const newUser = {
      id: this.generateId(),
      email: data.email,
      name: data.name,
      password: data.password, // In real app, this would be hashed
      role: 'USER' as UserRole,
      active: true,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

    const authenticatedUser: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      createdAt: new Date(newUser.createdAt),
      role: newUser.role,
      active: newUser.active,
      token: this.generateToken(newUser),
    };

    this.currentUserSubject.next(authenticatedUser);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(authenticatedUser));

    return {
      success: true,
      message: 'Account created successfully!',
      user: authenticatedUser,
    };
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

  private getRegisteredUsers(): RegisteredUser[] {
    try {
      const stored = localStorage.getItem(this.USERS_KEY);
      if (stored) {
        const users = JSON.parse(stored) as RegisteredUser[];
        return this.ensureDemoUsers(users);
      }

      const demoUsers = this.ensureDemoUsers([]);
      localStorage.setItem(this.USERS_KEY, JSON.stringify(demoUsers));
      return demoUsers;
    } catch {
      return this.ensureDemoUsers([]);
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private generateToken(user: RegisteredUser): string {
    return btoa(`${user.id}:${user.email}:${user.role}:${Date.now()}`);
  }

  private ensureDemoUsers(users: RegisteredUser[]): RegisteredUser[] {
    const migratedUsers = users.map((user) => ({
      ...user,
      role: user.role || ('USER' as UserRole),
      active: user.active !== false,
    }));

    const demoUsers: RegisteredUser[] = [
      {
        id: 'admin-demo',
        email: 'admin@sfaxstore.tn',
        name: 'Admin SfaxStore',
        password: 'admin123',
        role: 'ADMIN',
        active: true,
        createdAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 'user-demo',
        email: 'user@sfaxstore.tn',
        name: 'Demo User',
        password: 'user123',
        role: 'USER',
        active: true,
        createdAt: '2026-01-05T00:00:00.000Z',
      },
    ];

    for (const demoUser of demoUsers) {
      if (!migratedUsers.some((user) => user.email.toLowerCase() === demoUser.email)) {
        migratedUsers.push(demoUser);
      }
    }

    localStorage.setItem(this.USERS_KEY, JSON.stringify(migratedUsers));
    return migratedUsers;
  }
}
