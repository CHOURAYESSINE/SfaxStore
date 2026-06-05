import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, delay, of, tap } from 'rxjs';
import { Category } from '../models/admin.model';
import { AdminDataService } from './admin-data.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);
  private data = inject(AdminDataService);
  private apiUrl = `${environment.apiUrl}/categories`;
  private categoriesSubject = new BehaviorSubject<Category[]>(this.withCounts());
  categories$ = this.categoriesSubject.asObservable();

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl).pipe(
      catchError(() => of(this.withCounts()).pipe(delay(120)))
    );
  }

  create(category: Omit<Category, 'id' | 'productsCount'>): Observable<Category> {
    const categories = this.data.getCategories();
    const newCategory: Category = {
      ...category,
      id: this.data.nextId(categories),
    };

    return this.http.post<Category>(this.apiUrl, category).pipe(
      catchError(() => {
        this.data.saveCategories([...categories, newCategory]);
        return of(newCategory);
      }),
      tap(() => this.refresh())
    );
  }

  update(category: Category): Observable<Category> {
    const categories = this.data
      .getCategories()
      .map((item) => (item.id === category.id ? { ...item, ...category } : item));
    return this.http.put<Category>(`${this.apiUrl}/${category.id}`, category).pipe(
      catchError(() => {
        this.data.saveCategories(categories);
        return of(category);
      }),
      tap(() => this.refresh())
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        const categories = this.data.getCategories().filter((category) => category.id !== id);
        this.data.saveCategories(categories);
        return of(void 0);
      }),
      tap(() => this.refresh())
    );
  }

  private refresh(): void {
    this.categoriesSubject.next(this.withCounts());
  }

  private withCounts(): Category[] {
    const products = this.data.getProducts();
    return this.data.getCategories().map((category) => ({
      ...category,
      productsCount: products.filter((product) => product.categoryId === category.id).length,
    }));
  }
}
