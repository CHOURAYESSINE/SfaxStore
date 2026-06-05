import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AdminProduct } from '../models/admin.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminProductService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`;
  private productsSubject = new BehaviorSubject<AdminProduct[]>([]);
  products$ = this.productsSubject.asObservable();

  getAll(): Observable<AdminProduct[]> {
    return this.http.get<AdminProduct[]>(this.apiUrl).pipe(
      tap((products) => this.productsSubject.next(products))
    );
  }

  search(term: string, categoryId: number | 'all'): Observable<AdminProduct[]> {
    const normalizedTerm = term.trim().toLowerCase();
    let params = new HttpParams();
    if (normalizedTerm) {
      params = params.set('search', normalizedTerm);
    }
    if (categoryId !== 'all') {
      params = params.set('categoryId', categoryId);
    }

    return this.http.get<AdminProduct[]>(this.apiUrl, { params }).pipe(
      tap((products) => this.productsSubject.next(products))
    );
  }

  create(product: Omit<AdminProduct, 'id' | 'category' | 'createdAt'>): Observable<AdminProduct> {
    return this.http.post<AdminProduct>(this.apiUrl, product).pipe(
      tap(() => this.refresh())
    );
  }

  update(product: AdminProduct): Observable<AdminProduct> {
    return this.http.put<AdminProduct>(`${this.apiUrl}/${product.id}`, product).pipe(
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
