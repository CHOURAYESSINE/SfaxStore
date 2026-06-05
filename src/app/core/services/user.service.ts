import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { AdminUser, UserRole } from '../models/admin.model';
import { AdminDataService } from './admin-data.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private data = inject(AdminDataService);
  private apiUrl = `${environment.apiUrl}/users`;
  private usersSubject = new BehaviorSubject<AdminUser[]>(this.data.getUsers());
  users$ = this.usersSubject.asObservable();

  getAll(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(this.apiUrl).pipe(catchError(() => of(this.data.getUsers())));
  }

  updateRole(id: number, role: UserRole): Observable<AdminUser | undefined> {
    const users = this.data.getUsers().map((user) => (user.id === id ? { ...user, role } : user));
    return this.http.put<AdminUser>(`${this.apiUrl}/${id}/role`, { role }).pipe(
      catchError(() => {
        this.data.saveUsers(users);
        return of(users.find((user) => user.id === id));
      }),
      tap(() => this.refresh())
    );
  }

  toggleActive(id: number): Observable<AdminUser | undefined> {
    const users = this.data
      .getUsers()
      .map((user) => (user.id === id ? { ...user, active: !user.active } : user));
    return this.http.put<AdminUser>(`${this.apiUrl}/${id}/active`, {}).pipe(
      catchError(() => {
        this.data.saveUsers(users);
        return of(users.find((user) => user.id === id));
      }),
      tap(() => this.refresh())
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        this.data.saveUsers(this.data.getUsers().filter((user) => user.id !== id));
        return of(void 0);
      }),
      tap(() => this.refresh())
    );
  }

  private refresh(): void {
    this.usersSubject.next(this.data.getUsers());
  }
}
