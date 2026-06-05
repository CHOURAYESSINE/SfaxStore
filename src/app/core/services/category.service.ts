import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Category } from '../models/admin.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/categories`;
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  categories$ = this.categoriesSubject.asObservable();

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl).pipe(
      tap((categories) => this.categoriesSubject.next(categories))
    );
  }

  create(category: Omit<Category, 'id' | 'productsCount'>): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category).pipe(
      tap(() => this.refresh())
    );
  }

  update(category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${category.id}`, category).pipe(
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
