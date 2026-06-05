import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, delay, map, of, tap } from 'rxjs';
import { AdminProduct } from '../models/admin.model';
import { AdminDataService } from './admin-data.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminProductService {
  private http = inject(HttpClient);
  private data = inject(AdminDataService);
  private apiUrl = `${environment.apiUrl}/products`;
  private productsSubject = new BehaviorSubject<AdminProduct[]>(this.data.getProducts());
  products$ = this.productsSubject.asObservable();

  getAll(): Observable<AdminProduct[]> {
    return this.http.get<AdminProduct[]>(this.apiUrl).pipe(
      catchError(() => of(this.data.getProducts()).pipe(delay(120)))
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
      catchError(() =>
        this.getAll().pipe(
          map((products) =>
            products.filter((product) => {
              const matchesSearch =
                !normalizedTerm ||
                product.name.toLowerCase().includes(normalizedTerm) ||
                product.description.toLowerCase().includes(normalizedTerm);
              const matchesCategory = categoryId === 'all' || product.categoryId === categoryId;
              return matchesSearch && matchesCategory;
            })
          )
        )
      )
    );
  }

  create(product: Omit<AdminProduct, 'id' | 'category' | 'createdAt'>): Observable<AdminProduct> {
    const products = this.data.getProducts();
    const newProduct: AdminProduct = {
      ...product,
      id: this.data.nextId(products),
      createdAt: new Date().toISOString().slice(0, 10),
      sold: 0,
    };

    return this.http.post<AdminProduct>(this.apiUrl, product).pipe(
      catchError(() => {
        this.data.saveProducts([...products, newProduct]);
        return of(newProduct);
      }),
      tap(() => this.refresh())
    );
  }

  update(product: AdminProduct): Observable<AdminProduct> {
    const products = this.data
      .getProducts()
      .map((item) => (item.id === product.id ? { ...product } : item));
    return this.http.put<AdminProduct>(`${this.apiUrl}/${product.id}`, product).pipe(
      catchError(() => {
        this.data.saveProducts(products);
        return of(product);
      }),
      tap(() => this.refresh())
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        this.data.saveProducts(this.data.getProducts().filter((product) => product.id !== id));
        return of(void 0);
      }),
      tap(() => this.refresh())
    );
  }

  private refresh(): void {
    this.productsSubject.next(this.data.getProducts());
  }
}
