import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { Order, OrderStatus } from '../models/admin.model';
import { AdminDataService } from './admin-data.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);
  private data = inject(AdminDataService);
  private apiUrl = `${environment.apiUrl}/orders`;
  private ordersSubject = new BehaviorSubject<Order[]>(this.data.getOrders());
  orders$ = this.ordersSubject.asObservable();

  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl).pipe(catchError(() => of(this.data.getOrders())));
  }

  updateStatus(id: number, status: OrderStatus): Observable<Order | undefined> {
    const orders = this.data.getOrders().map((order) =>
      order.id === id ? { ...order, status } : order
    );
    return this.http.put<Order>(`${this.apiUrl}/${id}/status`, { status }).pipe(
      catchError(() => {
        this.data.saveOrders(orders);
        return of(orders.find((order) => order.id === id));
      }),
      tap(() => this.refresh())
    );
  }

  private refresh(): void {
    this.ordersSubject.next(this.data.getOrders());
  }
}
