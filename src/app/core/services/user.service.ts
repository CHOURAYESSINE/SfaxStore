import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AdminUser, UserRole } from '../models/admin.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;
  private usersSubject = new BehaviorSubject<AdminUser[]>([]);
  users$ = this.usersSubject.asObservable();

  getAll(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(this.apiUrl).pipe(
      tap((users) => this.usersSubject.next(users))
    );
  }

  updateRole(id: number, role: UserRole): Observable<AdminUser> {
    return this.http.put<AdminUser>(`${this.apiUrl}/${id}/role`, { role }).pipe(
      tap(() => this.refresh())
    );
  }

  toggleActive(id: number): Observable<AdminUser> {
    return this.http.put<AdminUser>(`${this.apiUrl}/${id}/active`, {}).pipe(
      tap(() => this.refresh())
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.refresh())
    );
  }

  private refresh(): void {
    this.getAll().subscribe();
  }
}
