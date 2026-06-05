import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryMetric, DashboardStats, MonthlyMetric } from '../models/admin.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/dashboard`;

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`);
  }

  getOrdersByMonth(): Observable<MonthlyMetric[]> {
    return this.http.get<MonthlyMetric[]>(`${this.apiUrl}/orders-by-month`);
  }

  getRevenueByMonth(): Observable<MonthlyMetric[]> {
    return this.http.get<MonthlyMetric[]>(`${this.apiUrl}/revenue`);
  }

  getProductsByCategory(): Observable<CategoryMetric[]> {
    return this.http.get<CategoryMetric[]>(`${this.apiUrl}/products-by-category`);
  }

  getOrdersByStatus(): Observable<CategoryMetric[]> {
    return this.http.get<CategoryMetric[]>(`${this.apiUrl}/orders-by-status`);
  }
}
