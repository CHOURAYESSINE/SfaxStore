import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Order, OrderStatus } from '../models/admin.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/orders`;
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  orders$ = this.ordersSubject.asObservable();

  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl).pipe(
      tap((orders) => this.ordersSubject.next(orders))
    );
  }

  updateStatus(id: number, status: OrderStatus): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}/status`, { status }).pipe(
      tap(() => this.refresh())
    );
  }

  private refresh(): void {
    this.getAll().subscribe();
  }
}
