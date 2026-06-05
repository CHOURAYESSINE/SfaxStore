import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Order, OrderStatus } from '../../core/models/admin.model';
import { OrderService } from '../../core/services/order.service';
import { TndCurrencyPipe } from '../../shared/pipes/tnd-currency.pipe';

@Component({
  selector: 'app-admin-orders',
  imports: [FormsModule, TndCurrencyPipe],
  templateUrl: './admin-orders.component.html',
})
export class AdminOrdersComponent implements OnInit {
  private orderService = inject(OrderService);

  orders: Order[] = [];
  statuses: OrderStatus[] = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getAll().subscribe((orders) => {
      this.orders = orders;
    });
  }

  updateStatus(order: Order, status: OrderStatus): void {
    this.orderService.updateStatus(order.id, status).subscribe(() => {
      this.loadOrders();
    });
  }
}
