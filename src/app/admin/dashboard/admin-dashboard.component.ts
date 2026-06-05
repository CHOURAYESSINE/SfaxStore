import { Component, OnInit, inject } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { DashboardStats } from '../../core/models/admin.model';
import { DashboardService } from '../../core/services/dashboard.service';
import { TndCurrencyPipe } from '../../shared/pipes/tnd-currency.pipe';

@Component({
  selector: 'app-admin-dashboard',
  imports: [BaseChartDirective, TndCurrencyPipe],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  stats?: DashboardStats;
  ordersChart: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  categoryChart: ChartConfiguration<'pie'>['data'] = { labels: [], datasets: [] };
  revenueChart: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  statusChart: ChartConfiguration<'doughnut'>['data'] = { labels: [], datasets: [] };

  ngOnInit(): void {
    this.dashboardService.getStats().subscribe((stats) => {
      this.stats = stats;
    });

    this.dashboardService.getOrdersByMonth().subscribe((metrics) => {
      this.ordersChart = {
        labels: metrics.map((metric) => metric.label),
        datasets: [{ label: 'Orders', data: metrics.map((metric) => metric.value), backgroundColor: '#facc15' }],
      };
    });

    this.dashboardService.getProductsByCategory().subscribe((metrics) => {
      this.categoryChart = {
        labels: metrics.map((metric) => metric.category),
        datasets: [{ data: metrics.map((metric) => metric.value), backgroundColor: ['#facc15', '#111827', '#60a5fa', '#34d399'] }],
      };
    });

    this.dashboardService.getRevenueByMonth().subscribe((metrics) => {
      this.revenueChart = {
        labels: metrics.map((metric) => metric.label),
        datasets: [{ label: 'Revenue', data: metrics.map((metric) => metric.value), borderColor: '#111827', backgroundColor: '#facc15', tension: 0.35 }],
      };
    });

    this.dashboardService.getOrdersByStatus().subscribe((metrics) => {
      this.statusChart = {
        labels: metrics.map((metric) => metric.category),
        datasets: [{ data: metrics.map((metric) => metric.value), backgroundColor: ['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444'] }],
      };
    });
  }
}
