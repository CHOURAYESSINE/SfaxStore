import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { CategoryMetric, DashboardStats, MonthlyMetric } from '../models/admin.model';
import { AdminDataService } from './admin-data.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);
  private data = inject(AdminDataService);
  private apiUrl = `${environment.apiUrl}/dashboard`;

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`).pipe(
      catchError(() => this.getLocalStats())
    );
  }

  getOrdersByMonth(): Observable<MonthlyMetric[]> {
    return this.http.get<MonthlyMetric[]>(`${this.apiUrl}/orders-by-month`).pipe(
      catchError(() => of(this.monthlyMetrics((date) => this.data.getOrders().filter((order) => order.createdAt.startsWith(date)).length)))
    );
  }

  getRevenueByMonth(): Observable<MonthlyMetric[]> {
    return this.http.get<MonthlyMetric[]>(`${this.apiUrl}/revenue`).pipe(
      catchError(() =>
        of(
          this.monthlyMetrics((date) =>
            this.data
              .getOrders()
              .filter((order) => order.createdAt.startsWith(date))
              .reduce((sum, order) => sum + order.totalAmount, 0)
          )
        )
      )
    );
  }

  getProductsByCategory(): Observable<CategoryMetric[]> {
    return this.http.get<CategoryMetric[]>(`${this.apiUrl}/products-by-category`).pipe(
      catchError(() => {
        const products = this.data.getProducts();
        return of(
          this.data.getCategories().map((category) => ({
            category: category.name,
            value: products.filter((product) => product.categoryId === category.id).length,
          }))
        );
      })
    );
  }

  getOrdersByStatus(): Observable<CategoryMetric[]> {
    return this.http.get<CategoryMetric[]>(`${this.apiUrl}/orders-by-status`).pipe(
      catchError(() => {
        const orders = this.data.getOrders();
        return of(
          ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => ({
            category: status,
            value: orders.filter((order) => order.status === status).length,
          }))
        );
      })
    );
  }

  private getLocalStats(): Observable<DashboardStats> {
    const products = this.data.getProducts();
    const categories = this.data.getCategories();
    const orders = this.data.getOrders();
    const users = this.data.getUsers();
    const currentMonth = new Date().getMonth();

    return of({
      totalProducts: products.length,
      totalCategories: categories.length,
      totalOrders: orders.length,
      totalUsers: users.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
      monthlyOrders: orders.filter((order) => new Date(order.createdAt).getMonth() === currentMonth).length,
      lowStockProducts: products.filter((product) => product.stock <= 5).length,
      topProducts: [...products].sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 5),
      recentOrders: [...orders]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    });
  }

  private monthlyMetrics(getValue: (datePrefix: string) => number): MonthlyMetric[] {
    return ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06'].map((date) => ({
      label: date,
      value: getValue(date),
    }));
  }
}
